import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card, Empty, Segmented } from '../components/ui';
import TxRow from '../components/TxRow';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import { money, sum, todayISO, weekRange } from '../utils';

export default function HomeScreen({ navigation }) {
  const { currentUser, transactions } = useApp();
  const [range, setRange] = useState('daily');
  const mine = transactions.filter((t) => t.userId === currentUser.id);
  const today = todayISO();
  const [ws, we] = weekRange();
  const inRange = (t) =>
    range === 'daily' ? t.date === today : range === 'weekly' ? t.date >= ws && t.date <= we : t.date.slice(0, 7) === today.slice(0, 7);
  const list = mine.filter(inRange).sort((a, b) => (a.date < b.date ? 1 : -1));
  const inc = sum(list, 'income'); const exp = sum(list, 'expense');
  const balance = sum(mine, 'income') - sum(mine, 'expense');
  const label = { daily: 'Today', weekly: 'This week', monthly: 'This month' }[range];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text }}>Hello, {currentUser.name.split(' ')[0]} 👋</Text>
      <Text style={{ color: colors.muted, marginBottom: 14 }}>Here is your financial summary</Text>
      <Card style={{ backgroundColor: colors.primary }}>
        <Text style={{ color: '#CDE7E4' }}>Total balance</Text>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '800', marginVertical: 4 }}>{money(balance)}</Text>
        <Button
          title="+ Add Transaction"
          onPress={() => navigation.navigate('Transactions', { openAdd: true })}
          style={{ backgroundColor: '#fff', marginTop: 8, paddingVertical: 10 }}
          textStyle={{ color: colors.primary, fontWeight: '700' }}
        />
      </Card>

      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 }}>Reports</Text>
      <Segmented value={range} onChange={setRange} options={[{ label: 'Daily', value: 'daily' }, { label: 'Weekly', value: 'weekly' }, { label: 'Monthly', value: 'monthly' }]} />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
        <Card style={{ flex: 1, marginBottom: 0 }}><Text style={{ color: colors.muted }}>{label} income</Text><Text style={{ color: colors.income, fontWeight: '800', fontSize: 18 }}>{money(inc)}</Text></Card>
        <Card style={{ flex: 1, marginBottom: 0 }}><Text style={{ color: colors.muted }}>{label} expense</Text><Text style={{ color: colors.expense, fontWeight: '800', fontSize: 18 }}>{money(exp)}</Text></Card>
      </View>
      <Card><Text style={{ color: colors.muted }}>{label} net savings</Text><Text style={{ fontWeight: '800', fontSize: 20, color: inc - exp >= 0 ? colors.income : colors.expense }}>{money(inc - exp)}</Text></Card>

      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 }}>{label} transactions</Text>
      {list.length === 0 ? <Empty text={`No transactions for ${label.toLowerCase()}.`} /> : list.map((t) => <TxRow key={t.id} tx={t} />)}
    </ScrollView>
  );
}
