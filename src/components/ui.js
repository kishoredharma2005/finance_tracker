import React from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors } from '../theme';

export const Button = ({ title, onPress, variant = 'primary', style, textStyle }) => {
  const flat = StyleSheet.flatten(style) || {};
  const isLightBg = flat.backgroundColor === '#fff' || flat.backgroundColor === '#ffffff' || flat.backgroundColor === 'white';
  const defaultTextColor = variant === 'outline'
    ? colors.primary
    : isLightBg
      ? colors.primary
      : colors.white;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}
      style={[s.btn, variant === 'outline' && s.btnOutline, variant === 'danger' && { backgroundColor: colors.expense }, style]}>
      <Text style={[s.btnText, { color: defaultTextColor }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
export const Input = ({ label, error, ...props }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={s.label}>{label}</Text>
    <TextInput placeholderTextColor={colors.muted} autoCapitalize="none" {...props} style={[s.input, error && { borderColor: colors.expense }]} />
    {!!error && <Text style={s.error}>{error}</Text>}
  </View>
);
export const Card = ({ children, style }) => <View style={[s.card, style]}>{children}</View>;
export const Segmented = ({ options, value, onChange }) => (
  <View style={s.seg}>
    {options.map((o) => (
      <TouchableOpacity key={o.value} style={[s.segItem, value === o.value && s.segActive]} onPress={() => onChange(o.value)}>
        <Text style={[s.segText, value === o.value && { color: colors.white }]}>{o.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);
export const Empty = ({ text }) => <Text style={{ textAlign: 'center', color: colors.muted, marginVertical: 24 }}>{text}</Text>;

const s = StyleSheet.create({
  btn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  btnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  label: { color: colors.text, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.text },
  error: { color: colors.expense, marginTop: 4, fontSize: 12 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  seg: { flexDirection: 'row', backgroundColor: '#E6EEEC', borderRadius: 12, padding: 4, marginBottom: 14 },
  segItem: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 9 },
  segActive: { backgroundColor: colors.primary },
  segText: { fontWeight: '600', color: colors.text },
});
