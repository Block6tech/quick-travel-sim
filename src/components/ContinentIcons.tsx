import europeMap from "@/assets/continent-europe.png";
import asiaMap from "@/assets/continent-asia.png";
import middleEastMap from "@/assets/continent-middleeast.png";
import globalMap from "@/assets/continent-global.png";

const continentImages: Record<string, string> = {
  EU: europeMap,
  AS: asiaMap,
  ME: middleEastMap,
  GL: globalMap,
  GP: globalMap,
};

export function ContinentIcon({
  code,
  className = "w-5 h-5",
}: {
  code: string;
  className?: string;
}) {
  const src = continentImages[code] || globalMap;
  return (
    <img
      src={src}
      alt={code}
      className={`${className} object-contain`}
      draggable={false}
    />
  );
}

export default ContinentIcon;
