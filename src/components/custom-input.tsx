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
  password?: boolean;
  number?: boolean;
  desc?: boolean;
  error?: string | null;
  right?: ReactNode;
}

export default function Input({ label, icon, password, number = false, desc, error, right, style, onFocus, onBlur, ...rest }: InputProps) {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ paddingVertical: Spacing.two }}>
      {label ? (
        <ThemedText type="label" themeColor="textSecondary" style={{ marginBottom: Spacing.two }}>
          {label}
        </ThemedText>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: desc ? "flex-start" : "center",
          minHeight: desc ? 110 : 54,
          borderRadius: Radius.md,
          backgroundColor: theme.card,
          borderWidth: 1.5,
          borderColor: error ? theme.danger : focused ? theme.accent : theme.line,
          overflow: "hidden",
        }}
      >
        {icon && (
          <View
            style={{
              width: 50,
              alignSelf: "stretch",
              alignItems: "center",
              justifyContent: desc ? "flex-start" : "center",
              paddingTop: desc ? 16 : 0,
              backgroundColor: focused ? theme.accentSurface : theme.cardAlt,
            }}
          >
            <Ionicons name={icon} size={19} color={focused ? theme.accent : theme.textSecondary} />
          </View>
        )}
        <TextInput
          {...rest}
          style={[
            {
              flex: 1,
              color: theme.text,
              fontSize: 16,
              paddingHorizontal: Spacing.three,
              paddingVertical: desc ? 16 : 0,
              height: desc ? undefined : 54,
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
          <TouchableOpacity onPress={() => setShow(!show)} hitSlop={10} style={{ paddingRight: Spacing.three }} accessibilityLabel={show ? "Hide password" : "Show password"}>
            <Ionicons name={show ? "eye-off-outline" : "eye-outline"} size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        {right}
      </View>
      {error ? (
        <ThemedText type="caption" style={{ color: theme.danger, marginTop: Spacing.one + 2 }}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}
