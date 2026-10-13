import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useRef, useState } from "react";
import { NativeSyntheticEvent, TextInput, TextInputKeyPressEventData, View } from "react-native";

export default function OTPInput({ length = 6, onChange }: { length?: number; onChange?: (code: string) => void }) {
  const theme = useTheme();
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [focused, setFocused] = useState(0);
  const refs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => refs.current[0]?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const update = (next: string[]) => {
    setOtp(next);
    onChange?.(next.join(""));
  };

  const handleChange = (text: string, index: number) => {
    const value = text.replace(/[^0-9]/g, "");
    const next = [...otp];

    if (value === "") {
      next[index] = "";
      update(next);
      return;
    }
    if (value.length > 1) {
      value
        .slice(0, length - index)
        .split("")
        .forEach((d, i) => (next[index + i] = d));
      update(next);
      refs.current[Math.min(index + value.length, length - 1)]?.focus();
      return;
    }
    next[index] = value;
    update(next);
    if (index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key !== "Backspace") return;
    if (otp[index] === "" && index > 0) {
      const next = [...otp];
      next[index - 1] = "";
      update(next);
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={{ flexDirection: "row", gap: Spacing.two, marginVertical: Spacing.three }}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(r) => {
            refs.current[index] = r;
          }}
          value={digit}
          onChangeText={(t) => handleChange(t, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onFocus={() => setFocused(index)}
          keyboardType="number-pad"
          maxLength={length}
          textAlign="center"
          selectionColor={theme.accent}
          style={{
            flex: 1,
            height: 62,
            borderRadius: Radius.md,
            borderWidth: 1.5,
            borderColor: focused === index ? theme.accent : digit ? theme.inkSoft : theme.line,
            backgroundColor: theme.card,
            color: theme.text,
            fontSize: 24,
            fontWeight: "800",
            padding: 0,
          }}
        />
      ))}
    </View>
  );
}
