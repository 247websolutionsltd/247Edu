import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode, useState } from "react";
import { TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface InputProps extends TextInputProps {
  label?: string;
  icon?: IconName;
  prefix?: string;
  password?: boolean;
  number?: boolean;
  desc?: boolean;
  error?: string | null;
  right?: ReactNode;
}

export default function Input({
  label,
  icon,
  prefix,
  password,
  number = false,
  desc,
  error,
  right,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ paddingVertical: Spacing.two }}>
      {label ? (
        <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: Spacing.two }}>
          {label}
        </ThemedText>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: desc ? "flex-start" : "center",
          minHeight: desc ? 110 : 58,
          paddingHorizontal: Spacing.three,
          borderRadius: Radius.md,
          backgroundColor: theme.card,
          borderWidth: 1.5,
          borderColor: error ? theme.danger : focused ? theme.accent : theme.line,
        }}
      >
        {icon && <Ionicons name={icon} size={20} color={focused ? theme.accent : theme.textSecondary} style={{ marginRight: Spacing.two, marginTop: desc ? 16 : 0 }} />}
        {prefix && (
          <ThemedText type="bold" themeColor="textSecondary" style={{ marginRight: Spacing.one, marginTop: desc ? 14 : 0 }}>
            {prefix}
          </ThemedText>
        )}
        <TextInput
          {...rest}
          style={[
            {
              flex: 1,
              color: theme.text,
              fontSize: 16,
              paddingVertical: desc ? 16 : 0,
              height: desc ? undefined : 58,
              textAlignVertical: desc ? "top" : "center",
            },
            style,
          ]}
          secureTextEntry={password === true && !show}
          keyboardType={number ? "numeric" : rest.keyboardType ?? "default"}
          multiline={desc}
          placeholderTextColor={theme.inkSoft}
          selectionColor={theme.accent}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
        />
        {password && (
          <TouchableOpacity onPress={() => setShow(!show)} hitSlop={10} accessibilityLabel={show ? "Hide password" : "Show password"}>
            <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        {right}
      </View>
      {error ? (
        <ThemedText type="caption" style={{ color: theme.danger, marginTop: Spacing.one }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}
