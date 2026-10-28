import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card } from '../components/ui';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

const Row = ({ label, value }) => (
  <View style={{ paddingVertical: 10, borderBottomWidth: 0.5, borderColor: colors.border }}>
    <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
    <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>{value}</Text>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const { currentUser, transactions } = useApp();
  const count = transactions.filter((t) => t.userId === currentUser.id).length;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ alignItems: 'center', marginVertical: 14 }}>
        <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 38, fontWeight: '800' }}>{currentUser.name[0].toUpperCase()}</Text>
        </View>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 10 }}>{currentUser.name}</Text>
        <Text style={{ color: colors.muted, textTransform: 'capitalize' }}>{currentUser.role}</Text>
      </View>
      <Card>
        <Row label="Full name" value={currentUser.name} />
        <Row label="Email" value={currentUser.email} />
        <Row label="Mobile" value={currentUser.phone} />
        <Row label="Transactions recorded" value={String(count)} />
      </Card>
      <Button title="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
    </ScrollView>
  );
}
