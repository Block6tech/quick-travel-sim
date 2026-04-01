const regionEmojis: Record<string, string> = {
  EU: "🇪🇺",
  AS: "🌏",
  ME: "🕌",
  GL: "🌍",
  GP: "🌐",
};

export function ContinentIcon({
  code,
  className = "w-5 h-5",
}: {
  code: string;
  className?: string;
}) {
  const emoji = regionEmojis[code];
  return (
    <span className={`${className} flex items-center justify-center text-lg leading-none`}>
      {emoji ?? "🌍"}
    </span>
  );
}

export default ContinentIcon;
