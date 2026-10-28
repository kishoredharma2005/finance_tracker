import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../components/ui';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import { isEmail, isPhone } from '../utils';

export default function EditProfileScreen({ navigation }) {
  const { currentUser, updateProfile } = useApp();
  const [f, setF] = useState({ name: currentUser.name, email: currentUser.email, phone: currentUser.phone });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const save = () => {
    const e = {};
    if (f.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!isEmail(f.email.trim())) e.email = 'Enter a valid email';
    if (!isPhone(f.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number';
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = updateProfile({ name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim() });
    if (!r.ok) setErrors({ email: r.error }); else navigation.goBack();
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <Ionicons name="arrow-back" size={22} color={colors.primary} /><Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 6 }}>Back to profile</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 14 }}>Edit profile</Text>
      <Input label="Full name" value={f.name} onChangeText={set('name')} autoCapitalize="words" error={errors.name} />
      <Input label="Email" value={f.email} onChangeText={set('email')} keyboardType="email-address" error={errors.email} />
      <Input label="Mobile number" value={f.phone} onChangeText={set('phone')} keyboardType="number-pad" maxLength={10} error={errors.phone} />
      <Button title="Save changes" onPress={save} />
    </ScrollView>
  );
}
