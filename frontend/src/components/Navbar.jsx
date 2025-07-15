function Navbar() {
  return (
    <div className="h-[64px] w-[100%] flex flex-row items-center font- justify-between">
      <div className="text-h1 text-primary">SeenIt</div>
      <div className="text-base text-textmuted flex flex-row gap-[32px]">
        <div className="text-primarysoft hover:underline cursor-pointer">
          AI
        </div>
        <div className="hover:underline cursor-pointer">My List</div>
        <div className="hover:underline cursor-pointer">Friends</div>
        <div className="hover:underline cursor-pointer">Profile</div>
        <div className="hover:underline cursor-pointer">Logout</div>
      </div>
    </div>
  );
}

export default Navbar;





