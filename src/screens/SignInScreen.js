import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { Button, Input, Segmented } from '../components/ui';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import { isEmail } from '../utils';

export default function SignInScreen({ navigation }) {
  const { signIn } = useApp();
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required'; else if (!isEmail(email.trim())) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required'; else if (password.length < 6) e.password = 'Minimum 6 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    const r = signIn(email.trim(), password, role);
    if (!r.ok) setErrors({ form: r.error });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 4 }}>Welcome back</Text>
      <Text style={{ color: colors.muted, marginBottom: 18 }}>Sign in to continue</Text>
      <Segmented value={role} onChange={setRole} options={[{ label: 'Customer', value: 'customer' }, { label: 'Admin', value: 'admin' }]} />
      <Input label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" error={errors.email} />
      <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••" error={errors.password} />
      {!!errors.form && <Text style={{ color: colors.expense, marginBottom: 10 }}>{errors.form}</Text>}
      <Button title="Sign In" onPress={submit} />
      <Text onPress={() => navigation.navigate('SignUp')} style={{ textAlign: 'center', marginTop: 16, color: colors.primary, fontWeight: '600' }}>New here? Create an account</Text>
      <Text style={{ textAlign: 'center', marginTop: 24, color: colors.muted, fontSize: 12 }}>
        Demo — Customer: demo@fin.com / Demo@123{'\n'}Admin: admin@fin.com / Admin@123
      </Text>
    </ScrollView>
  );
}
