import { Plus, Minus, Star } from "lucide-react";

export default function Card({
  entry,
  onEdit,
  mediaConfig,
  onIncrement,
  onDecrement,
}) {
  // Remove the store import since we're using passed functions
  // const { incrementEpisodes, decrementEpisodes } = useAnimeBackendStore();

  const {
    _id,
    title,
    year,
    status,
    yourStatus,
    consumed,
    released,
    rating,
    imageUrl,
    // Legacy field names for backward compatibility
    animeStatus,
    mangaStatus,
    showStatus,
    comicStatus,
    episodesWatched,
    chaptersRead,
    issuesRead,
    episodesTotal,
    chaptersTotal,
    issuesTotal,
  } = entry;

  // Get the correct status and progress values (prioritize standardized fields)
  const mediaStatus = status || entry[mediaConfig.statusField] || animeStatus;
  const watchedCount =
    consumed || entry[mediaConfig.consumedField] || episodesWatched || 0;
  const totalCount =
    released || entry[mediaConfig.releasedField] || episodesTotal || 0;
  const maxStars = 5;
  const filledStars = Math.floor(rating);
  const stars = Array.from({ length: maxStars }, (_, i) => (
    <Star
      key={i}
      size={16}
      color={i < filledStars ? "#CFC215" : "#B2B2B2"}
      fill={i < filledStars ? "#CFC215" : "#B2B2B2"}
    />
  ));

  // Determine background and text styles based on yourStatus
  let statusBg = "#80FFDC";
  let statusText = "text-dark";
  let statusBorder = "";

  if (yourStatus === "Active") {
    statusBg = "#00FFB7";
    statusText = "text-[#000000]";
    statusBorder = "";
  } else if (yourStatus === "Planned") {
    statusBg = "#3700FF";
    statusText = "text-[#f2f2f2]";
    statusBorder = "";
  } else if (yourStatus === "Completed") {
    statusBg = "#FF0048";
    statusText = "text-[#000000]";
    statusBorder = "";
  } else if (yourStatus === "Dropped") {
    statusBg = "#fff";
    statusText = "text-[#f2f2f2]";
    statusBorder = "border border-white";
  }

  return (
    <div className="w-[370px] flex flex-row gap-[16px] h-[129px]">
      <img src={imageUrl} className="w-[90px] h-[129px]" />
      <div className="w-[264px] h-[128px] flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[4px]">
          <div className="text-p1 text-text font-semibold truncate">
            {title}
          </div>
          <div className="text-textmuted text-p2 flex flex-row gap-[12px]">
            <div className="">{year}</div>
            <div className="">{mediaStatus}</div>
          </div>
        </div>
        <div className="flex flex-col gap-[4px] ">
          <div
            className={`px-[8px] py-[4px] font-semibold ${statusText} ${statusBorder}`}
            style={{
              width: "fit-content",
              height: "fit-content",
              background: statusBg,
            }}
          >
            {yourStatus}
          </div>
          <div className="flex flex-row gap-[8px]">
            <div className="text-text">
              {watchedCount}/{totalCount}
            </div>
            <div className="flex flex-row gap-[4px]">
              <button
                onClick={() => onIncrement(_id)}
                className="text-textmuted border border-gray-500 w-[24px] h-[24px] flex justify-center items-center cursor-pointer hover:bg-textmuted hover:text-medium"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => onDecrement(_id)}
                className="text-textmuted border border-gray-500 w-[24px] h-[24px] flex justify-center items-center cursor-pointer hover:bg-textmuted hover:text-medium"
              >
                <Minus size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-rwo justify-between">
            <button
              onClick={() => onEdit(entry)}
              className="text-textmuted cursor-pointer hover:underline"
            >
              Edit
            </button>
            <div className="flex flex-row gap-[8px]">
              <div className="flex flex-row gap-[4px]">{stars}</div>
              <div className="text-text">{rating}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
