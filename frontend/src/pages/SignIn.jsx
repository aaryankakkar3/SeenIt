import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import Dither from "../components/react-components/Dither";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-row gap-[64px] h-[100vh] p-[64px] justify-center">
      <div className="w-[50%] relative h-full rounded-[36px] overflow-hidden">
        <Dither
          waveColor={[0.784, 1, 0]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute top-[60px] left-[60px] text-h1 font-semibold text-text cursor-pointer">
          SeenIt
        </div>
      </div>
      <div className="w-[50%] flex flex-col items-center justify-center gap-[32px] text-base p-[64px]">
        <div className="text-h1">Sign In</div>
        <div className="flex flex-col w-[100%] gap-[16px]">
          <div className="w-[100%] h-[52px] bg-bg px-[30px]">
            <input
              autoComplete="off"
              type="text"
              id="email"
              placeholder="Email"
              className="w-[100%] h-[100%] placeholder:text-muted focus:outline-none"
            />
          </div>
          <div className="w-[100%] h-[52px] bg-bg flex flex-row px-[30px]">
            <input
              autoComplete="off"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              className="w-[100%] h-[100%] placeholder:text-muted focus:outline-none"
            />
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff className="text-muted cursor-pointer h-[24px] w-[24px]" />
              ) : (
                <Eye className="text-muted  cursor-pointer h-[24px] w-[24px]" />
              )}
            </button>
          </div>
          <button className="h-[32px] w-[100%] text-muted flex justify-end hover:underline cursor-pointer">
            Forgot Password?
          </button>
        </div>
        <div className="flex flex-col w-[100%] gap-[16px]">
          <button className="h-[52px] w-[100%] bg-text flex justify-center items-center text-bg-dark font-semibold cursor-pointer hover:bg-text-muted">
            Login
          </button>
          <button className="h-[52px] w-[100%] bg-bg flex justify-center items-center text-text gap-[16px] cursor-pointer hover:bg-light">
            <FaGoogle className="w-36px h-36px" />
            <div>Sign in with Google</div>
          </button>
        </div>
        <div className="text-muted">
          Don't have an account?{" "}
          <button className="text-primary hover:underline cursor-pointer">
            Sign In.
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
