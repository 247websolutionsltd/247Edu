import Avatar from "@/components/avatar";
import Button from "@/components/button";
import Container from "@/components/custom-container";
import Input from "@/components/custom-input";
import Header from "@/components/header";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/PageContext";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function EditProfile() {
  const { owner, updateOwner } = useAuth();
  const [name, setName] = useState(owner.name);
  const [phone, setPhone] = useState(owner.phone);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return setError("Your name can't be empty.");
    setError(null);
    setSaving(true);
    try {
      await updateOwner({ name: name.trim(), phone: phone.trim() });
      router.back();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container edges={["top", "bottom"]}>
      <Header title="Edit profile" />
      <View style={{ paddingHorizontal: Spacing.three }}>
        <View style={{ alignItems: "center", marginVertical: Spacing.three }}>
          <Avatar name={name || owner.name} size={92} />
        </View>
        <Input label="Full name" icon="person-outline" value={name} onChangeText={setName} error={error} />
        <Input label="Email" icon="mail-outline" value={owner.email} editable={false} autoCapitalize="none" keyboardType="email-address" />
        <Input label="Phone number" icon="call-outline" value={phone} onChangeText={setPhone} number />
        <Button title="Save changes" onPress={save} loading={saving} style={{ marginTop: Spacing.four }} />
      </View>
    </Container>
  );
}
