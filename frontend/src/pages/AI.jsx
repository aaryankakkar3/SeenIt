import Navbar from "../components/Navbar";
import { useRef, useEffect } from "react";

function AI() {
  const textareaRef = useRef(null);

  const handleTextareaChange = (e) => {
    const textarea = e.target;
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    // Set height to scrollHeight to fit content
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const handleTextareaInput = (e) => {
    handleTextareaChange(e);
  };

  // Auto-resize on mount for placeholder text
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, []);

  return (
    <div className="px-[64px] py-[32px] flex flex-col gap-[40px] ">
      <Navbar />
      <div className="flex flex-col gap-[32px] ">
        <div className="flex flex-col gap-[16px]">
          <div className="text-h2">Give Us Context</div>
          <div className="p-[16px] border border-text ">
            <textarea
              ref={textareaRef}
              placeholder="Use this only to give extra details that aren't covered by the filters below- like a specific mood, pacing, media you've really liked, or anything you want us to avoid."
              className="w-full bg-transparent focus:outline-none placeholder:text-textmuted overflow-hidden resize-none"
              onInput={handleTextareaInput}
              rows={1}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[16px]">
          <div className="text-h2">Filters</div>
          <div className="flex flex-row gap-[16px] w-full">
            <div className="w-[33%] border border-textmuted flex flex-col gap-[8px] p-[16px]">
              <div className="text-text text-p1 ">Media Type</div>
              <div className="flex flex-col text-text text-p2 gap-[4px]">
                <div className="">Anime</div>
                <div className="">Manga</div>
                <div className="">Shows</div>
                <div className="">Movies</div>
                <div className="">Games</div>
                <div className="">Books</div>
                <div className="">Comics</div>
              </div>
            </div>
            <div className="w-[67%] border border-textmuted flex flex-col gap-[8px] p-[16px]">
              <div className="text-text text-p1 ">Media Type</div>
              <div className="grid grid-cols-4 text-text text-p2 gap-[4px]">
                <div className="">Anime</div>
                <div className="">Manga</div>
                <div className="">Shows</div>
                <div className="">Movies</div>
                <div className="">Games</div>
                <div className="">Books</div>
                <div className="">Comics</div>
                <div className="">Anime</div>
                <div className="">Manga</div>
                <div className="">Shows</div>
                <div className="">Movies</div>
                <div className="">Games</div>
                <div className="">Books</div>
                <div className="">Comics</div>
                <div className="">Anime</div>
                <div className="">Manga</div>
                <div className="">Shows</div>
                <div className="">Movies</div>
                <div className="">Games</div>
                <div className="">Books</div>
                <div className="">Comics</div>
                <div className="">Anime</div>
                <div className="">Manga</div>
                <div className="">Shows</div>
                <div className="">Movies</div>
                <div className="">Games</div>
                <div className="">Books</div>
                <div className="">Comics</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-[8px]">
          <div className="text-text text-p1">
            Do you want to use your logged data to improve suggestions?
          </div>
          <button className="h-[20px] w-[20px] border"></button>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            type="submit"
            className="px-[16px] py-[8px] w-fit h-fit text-p1  bg-primary flex justify-center items-center text-dark font-semibold cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Suggestions
          </button>
        </div>
      </div>
    </div>
  );
}

export default AI;
