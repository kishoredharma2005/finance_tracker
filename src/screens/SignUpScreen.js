import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { Button, Input, Segmented } from '../components/ui';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import { isEmail, isPhone } from '../utils';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useApp();
  const [role, setRole] = useState('customer');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const submit = () => {
    const e = {};
    if (f.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!isEmail(f.email.trim())) e.email = 'Enter a valid email';
    if (!isPhone(f.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number';
    if (f.password.length < 6) e.password = 'Minimum 6 characters';
    if (f.confirm !== f.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = signUp({ name: f.name.trim(), email: f.email.trim(), phone: f.phone.trim(), password: f.password, role });
    if (!r.ok) setErrors({ email: r.error });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 4 }}>Create account</Text>
      <Text style={{ color: colors.muted, marginBottom: 18 }}>Join as a customer or admin</Text>
      <Segmented value={role} onChange={setRole} options={[{ label: 'Customer', value: 'customer' }, { label: 'Admin', value: 'admin' }]} />
      <Input label="Full name" value={f.name} onChangeText={set('name')} autoCapitalize="words" placeholder="Your name" error={errors.name} />
      <Input label="Email" value={f.email} onChangeText={set('email')} keyboardType="email-address" placeholder="you@example.com" error={errors.email} />
      <Input label="Mobile number" value={f.phone} onChangeText={set('phone')} keyboardType="number-pad" maxLength={10} placeholder="9876543210" error={errors.phone} />
      <Input label="Password" value={f.password} onChangeText={set('password')} secureTextEntry placeholder="Min 6 characters" error={errors.password} />
      <Input label="Confirm password" value={f.confirm} onChangeText={set('confirm')} secureTextEntry placeholder="Re-enter password" error={errors.confirm} />
      <Button title="Sign Up" onPress={submit} />
      <Text onPress={() => navigation.navigate('SignIn')} style={{ textAlign: 'center', marginTop: 16, color: colors.primary, fontWeight: '600' }}>Already have an account? Sign in</Text>
    </ScrollView>
  );
}
