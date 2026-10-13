import { splitMoney } from "@/lib/format";
import { Brand } from "@/constants/brand";
import { Text } from "react-native";

/** Large balance-style figure: ₦ small, whole number large, kobo small. */
export default function BigAmount({
  value,
  hidden = false,
  size = 38,
  color,
  mutedColor,
  decimals = true,
}: {
  value: number;
  hidden?: boolean;
  size?: number;
  color: string;
  mutedColor?: string;
  decimals?: boolean;
}) {
  const { whole, kobo } = splitMoney(value);
  const muted = mutedColor ?? color;
  const small = { fontSize: size * 0.5, fontWeight: "700" as const, color: muted };
  if (hidden) {
    return <Text style={{ fontSize: size, fontWeight: "800", color, letterSpacing: 2 }}>{Brand.currency}••••••</Text>;
  }
  return (
    <Text style={{ color, fontVariant: ["tabular-nums"] }} numberOfLines={1} adjustsFontSizeToFit>
      <Text style={small}>{Brand.currency}</Text>
      <Text style={{ fontSize: size, fontWeight: "800", letterSpacing: -1 }}>{whole}</Text>
      {decimals && <Text style={small}>.{kobo}</Text>}
    </Text>
  );
}
