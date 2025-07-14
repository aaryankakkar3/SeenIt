export default function QueryItem({ queryResult, onSelect }) {
  const { title, year, imageUrl } = queryResult;

  return (
    <button
      onClick={() => onSelect(queryResult)}
      className="flex flex-row justify-start items-center gap-[8px] p-[4px] h-[84px] cursor-pointer hover:bg-light"
    >
      <img src={imageUrl} className="w-[47px] h-[68px]" />
      <div className="flex flex-col justify-center items-start gap-[4px]">
        <div className="flex items-start justify-start truncate text-text">
          {title}
        </div>
        <div className="text-muted">{year}</div>
      </div>
    </button>
  );
}
