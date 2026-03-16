import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { formatNGN, getPriceStatus } from "../data/mockData";

interface Props {
  price: number;
  avgMarketPrice: number;
}

export default function PriceIntelligenceBadge({
  price,
  avgMarketPrice,
}: Props) {
  const status = getPriceStatus(price, avgMarketPrice);
  if (status === "above")
    return (
      <span className="inline-flex items-center gap-1 price-above rounded-full text-xs px-2 py-0.5 font-semibold">
        <TrendingUp size={11} />
        Above Market ({formatNGN(avgMarketPrice)} avg)
      </span>
    );
  if (status === "below")
    return (
      <span className="inline-flex items-center gap-1 price-fair rounded-full text-xs px-2 py-0.5 font-semibold">
        <TrendingDown size={11} />
        Below Market ({formatNGN(avgMarketPrice)} avg)
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 price-fair rounded-full text-xs px-2 py-0.5 font-semibold">
      <Minus size={11} />
      Fair Price ({formatNGN(avgMarketPrice)} avg)
    </span>
  );
}
