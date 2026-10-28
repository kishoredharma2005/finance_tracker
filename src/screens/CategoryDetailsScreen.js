import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Empty } from '../components/ui';
import TxRow from '../components/TxRow';
import { useApp } from '../context/AppContext';
import { catInfo, colors } from '../theme';
import { money, monthKey, todayISO } from '../utils';

export default function CategoryDetailsScreen({ route, navigation }) {
  const { category } = route.params;
  const c = catInfo(category);
  const { currentUser, transactions } = useApp();
  const list = transactions.filter((t) => t.userId === currentUser.id && t.category === category).sort((a, b) => (a.date < b.date ? 1 : -1));
  const total = list.reduce((a, t) => a + t.amount, 0);
  const thisMonth = list.filter((t) => monthKey(t.date) === monthKey(todayISO())).reduce((a, t) => a + t.amount, 0);
  const pct = c.budget ? Math.min(100, Math.round((thisMonth / c.budget) * 100)) : 0;
  const over = c.budget && thisMonth > c.budget;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <Ionicons name="arrow-back" size={22} color={colors.primary} /><Text style={{ color: colors.primary, fontWeight: '700', marginLeft: 6 }}>Back to categories</Text>
      </TouchableOpacity>
      <Card style={{ alignItems: 'center' }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: c.color + '22', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={c.icon} size={30} color={c.color} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 8 }}>{category}</Text>
        <Text style={{ fontSize: 28, fontWeight: '800', color: c.type === 'income' ? colors.income : colors.expense }}>{money(total)}</Text>
        <Text style={{ color: colors.muted }}>{list.length} transaction{list.length === 1 ? '' : 's'} overall</Text>
      </Card>
      {c.type === 'expense' && (
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '700', color: colors.text }}>Monthly budget</Text>
            <Text style={{ color: colors.muted }}>{money(thisMonth)} / {money(c.budget)}</Text>
          </View>
          <View style={{ height: 10, backgroundColor: '#E6EEEC', borderRadius: 5, marginTop: 10, overflow: 'hidden' }}>
            <View style={{ width: `${pct}%`, height: 10, backgroundColor: over ? colors.expense : c.color }} />
          </View>
          <Text style={{ color: over ? colors.expense : colors.muted, marginTop: 8, fontSize: 12 }}>
            {over ? `Over budget by ${money(thisMonth - c.budget)}` : `${pct}% used • ${money(c.budget - thisMonth)} left this month`}
          </Text>
        </Card>
      )}
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 }}>All transactions</Text>
      {list.length === 0 ? <Empty text="No transactions in this category yet." /> : list.map((t) => <TxRow key={t.id} tx={t} />)}
    </ScrollView>
  );
}
