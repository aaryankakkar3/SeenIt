export default function QueryItem({ queryResult, onSelect }) {
  const { title, year, imageUrl } = queryResult;

  return (
    <button
      onClick={() => onSelect(queryResult)}
      className="flex flex-row justify-start items-center gap-[8px] p-[4px] cursor-pointer hover:bg-light w-full overflow-x-hidden flex-shrink-0"
    >
      <img src={imageUrl} className="w-[47px] h-[68px]" />
      <div className="flex flex-col justify-center items-start gap-[4px] flex-1 min-w-0">
        <div className="text-text w-full text-left line-clamp-2">{title}</div>
        <div className="text-textmuted">{year}</div>
      </div>
    </button>
  );
}
