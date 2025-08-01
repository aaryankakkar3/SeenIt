import { generateToken } from "../lib/utils.js";
import { sendVerificationEmail } from "../lib/email.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // Password validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Full name validation
    const fullNameWords = fullName.trim().split(/\s+/);
    if (fullNameWords.length !== 2) {
      return res.status(400).json({
        message:
          "Full name must contain exactly two words (first and last name)",
      });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    if (newUser) {
      await newUser.save();

      // Send verification email
      try {
        await sendVerificationEmail(email, verificationToken);
        console.log(`Verification email sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Don't fail the signup if email fails, but log it
      }

      res.status(201).json({
        message:
          "Account created successfully! Please check your email to verify your account.",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        verified: newUser.verified,
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({ message: validationErrors[0] });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please enter a valid email address" });
    }

    // Password validation
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(400).json({
        message:
          "Please verify your email first. Check your inbox for the verification link.",
        needsVerification: true,
      });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      verified: user.verified,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    console.log("verifyEmail controller called with token:", req.query.token);
    const { token } = req.query;

    if (!token) {
      console.log("No token provided");
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    console.log("Looking for user with token:", token);
    // Find user with the verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() }, // Check if token hasn't expired
    });

    console.log("User found:", user ? "Yes" : "No");
    if (!user) {
      console.log("Checking if user was already verified...");

      // Check if this is a duplicate request after successful verification
      // We can't directly check by token since it's cleared, but we can be more helpful
      const recentlyVerifiedUser = await User.findOne({
        verified: true,
        verificationToken: { $exists: false },
      }).sort({ updatedAt: -1 });

      if (recentlyVerifiedUser) {
        console.log("Found recently verified user, likely duplicate request");
        // Return success for duplicate verification attempts
        return res.status(200).json({
          message:
            "Email is already verified! You can now log in to your account.",
          verified: true,
        });
      }

      console.log("Invalid or expired token");
      return res.status(400).json({
        message:
          "Invalid or expired verification token. Please request a new verification email.",
      });
    }

    console.log("Updating user verification status");
    // Update user to verified and clear verification fields
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    console.log("User verification completed successfully");
    res.status(200).json({
      message:
        "Email verified successfully! You can now log in to your account.",
      verified: true,
    });
  } catch (error) {
    console.log("Error in verifyEmail controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
      res.status(200).json({
        message:
          "Verification email sent successfully! Please check your inbox.",
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      res.status(500).json({
        message: "Failed to send verification email. Please try again.",
      });
    }
  } catch (error) {
    console.log("Error in resendVerificationEmail controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "No account found with this email. Please sign up first.",
      });
    }

    // Check if user's email is verified
    if (!user.verified) {
      return res.status(400).json({
        message:
          "Please verify your email address before signing in. Check your inbox for a verification link.",
        requiresVerification: true,
      });
    }

    // Generate token and send response
    generateToken(user._id, res);
    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic || picture,
      },
    });
  } catch (error) {
    console.log("Error in Google sign in:", error.message);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

export const googleSignUp = async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message:
          "Account already exists with this email. Please sign in instead.",
      });
    }

    // Validate that name has first and last name
    const fullNameWords = name.trim().split(/\s+/);
    const fullName =
      fullNameWords.length >= 2
        ? `${fullNameWords[0]} ${fullNameWords[fullNameWords.length - 1]}`
        : name;

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: await bcrypt.hash(googleId, 10), // Use Google ID as password hash
      profilePic: picture,
      verified: true, // Google accounts are pre-verified
    });

    await newUser.save();

    // Generate token and send response
    generateToken(newUser._id, res);
    res.status(201).json({
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });
  } catch (error) {
    console.log("Error in Google sign up:", error.message);
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(500).json({ message: "Google authentication failed" });
    }
  }
};
