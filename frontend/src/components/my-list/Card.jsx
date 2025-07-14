import { Plus, Minus, Star } from "lucide-react";
import { useAnimeBackendStore } from "../../store/anime.backend.store";

export default function Card({ entry, onEdit }) {
  const { incrementEpisodes, decrementEpisodes } = useAnimeBackendStore();

  const {
    _id,
    title,
    year,
    animeStatus,
    yourStatus,
    episodesWatched,
    episodesTotal,
    rating,
    imageUrl,
  } = entry;
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
  let statusText = "text-bg-dark";
  let statusBorder = "";

  if (yourStatus === "Active") {
    statusBg = "#00FFB7";
    statusText = "text-bg-dark";
    statusBorder = "";
  } else if (yourStatus === "Planned") {
    statusBg = "#3700FF";
    statusText = "text-text";
    statusBorder = "";
  } else if (yourStatus === "Completed") {
    statusBg = "#FF0048";
    statusText = "text-text";
    statusBorder = "";
  } else if (yourStatus === "Dropped") {
    statusBg = "#fff";
    statusText = "text-bg-dark";
    statusBorder = "border border-white";
  }

  return (
    <div className="w-[370px] flex flex-row gap-[16px] h-[129px]">
      <img src={imageUrl} className="w-[90px] h-[129px]" />
      <div className="w-[264px] h-[128px] flex flex-col gap-[8px]">
        <div className="flex flex-col gap-[4px]">
          <div className="text-base text-text font-semibold truncate">
            {title}
          </div>
          <div className="text-muted text-card flex flex-row gap-[12px]">
            <div className="">{year}</div>
            <div className="">{animeStatus}</div>
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
              {episodesWatched}/{episodesTotal}
            </div>
            <div className="flex flex-row gap-[4px]">
              <button
                onClick={() => incrementEpisodes(_id)}
                className="text-muted border border-gray-500 w-[24px] h-[24px] flex justify-center items-center cursor-pointer hover:bg-text-muted hover:text-bg"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => decrementEpisodes(_id)}
                className="text-muted border border-gray-500 w-[24px] h-[24px] flex justify-center items-center cursor-pointer hover:bg-text-muted hover:text-bg"
              >
                <Minus className="text-muted" size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-rwo justify-between">
            <button
              onClick={() => onEdit(entry)}
              className="text-muted cursor-pointer hover:underline"
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
