import { ShieldCheck } from "lucide-react";

interface Props {
  size?: "sm" | "md";
}

export default function VerifiedBadge({ size = "sm" }: Props) {
  const cls =
    size === "sm" ? "text-xs px-1.5 py-0.5 gap-0.5" : "text-sm px-2 py-1 gap-1";
  const iconSize = size === "sm" ? 10 : 14;
  return (
    <span
      className={`inline-flex items-center verified-badge rounded-full font-semibold ${cls}`}
    >
      <ShieldCheck size={iconSize} />
      Verified
    </span>
  );
}
