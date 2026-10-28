import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Card, Empty } from '../components/ui';
import { useApp } from '../context/AppContext';
import { CATEGORIES, catInfo, colors } from '../theme';
import { money, monthKey, shiftMonth, shortMonth, sum, todayISO } from '../utils';

const Bar = ({ label, value, max, color }) => (
  <View style={{ marginBottom: 12 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
      <Text style={{ color: colors.text, fontWeight: '600' }}>{label}</Text><Text style={{ color: colors.muted }}>{money(value)}</Text>
    </View>
    <View style={{ height: 8, backgroundColor: '#E6EEEC', borderRadius: 4, overflow: 'hidden' }}>
      <View style={{ width: `${max ? Math.max(2, (value / max) * 100) : 0}%`, height: 8, backgroundColor: color }} />
    </View>
  </View>
);

function MonthChart({ list }) {
  const now = monthKey(todayISO());
  const months = [5, 4, 3, 2, 1, 0].map((i) => shiftMonth(now, -i));
  const data = months.map((m) => { const l = list.filter((t) => monthKey(t.date) === m); return { m, inc: sum(l, 'income'), exp: sum(l, 'expense') }; });
  const max = Math.max(1, ...data.flatMap((d) => [d.inc, d.exp]));
  return (
    <Card>
      <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 12 }}>Income vs Expense (last 6 months)</Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 130 }}>
        {data.map((d) => (
          <View key={d.m} style={{ alignItems: 'center', flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110 }}>
              <View style={{ width: 11, height: (d.inc / max) * 110, backgroundColor: colors.income, borderRadius: 3, marginRight: 2 }} />
              <View style={{ width: 11, height: (d.exp / max) * 110, backgroundColor: colors.expense, borderRadius: 3 }} />
            </View>
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>{shortMonth(d.m)}</Text>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
        <Text style={{ color: colors.income, marginRight: 16 }}>■ Income</Text><Text style={{ color: colors.expense }}>■ Expense</Text>
      </View>
    </Card>
  );
}

function Breakdown({ list }) {
  const rows = CATEGORIES.filter((c) => c.type === 'expense').map((c) => ({ c, v: list.filter((t) => t.type === 'expense' && t.category === c.name).reduce((a, t) => a + t.amount, 0) })).filter((r) => r.v > 0).sort((a, b) => b.v - a.v);
  const max = rows[0]?.v || 0;
  return (
    <Card>
      <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 12 }}>Spending by category</Text>
      {rows.length === 0 ? <Empty text="No expenses yet." /> : rows.map((r) => <Bar key={r.c.name} label={r.c.name} value={r.v} max={max} color={r.c.color} />)}
    </Card>
  );
}

const Stat = ({ label, value, color }) => (
  <Card style={{ flex: 1, marginBottom: 0, minWidth: '45%' }}>
    <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
    <Text style={{ color: color || colors.text, fontWeight: '800', fontSize: 18, marginTop: 2 }}>{value}</Text>
  </Card>
);

export default function AnalysisScreen() {
  const { currentUser, transactions, users } = useApp();
  const isAdmin = currentUser.role === 'admin';
  const customers = users.filter((u) => u.role === 'customer');
  const list = isAdmin ? transactions : transactions.filter((t) => t.userId === currentUser.id);
  const inc = sum(list, 'income'); const exp = sum(list, 'expense');
  const rate = inc ? Math.round(((inc - exp) / inc) * 100) : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 12 }}>{isAdmin ? 'Platform analysis' : 'Your analysis'}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        {isAdmin && <Stat label="Customers" value={customers.length} />}
        {isAdmin && <Stat label="Transactions" value={list.length} />}
        <Stat label="Total income" value={money(inc)} color={colors.income} />
        <Stat label="Total expense" value={money(exp)} color={colors.expense} />
        <Stat label={isAdmin ? 'Net volume' : 'Savings'} value={money(inc - exp)} color={inc - exp >= 0 ? colors.income : colors.expense} />
        {!isAdmin && <Stat label="Savings rate" value={`${rate}%`} />}
      </View>
      <MonthChart list={list} />
      <Breakdown list={list} />
      {isAdmin && (
        <Card>
          <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 12 }}>Customers overview</Text>
          {customers.length === 0 ? <Empty text="No customers yet." /> : customers.map((u) => {
            const l = transactions.filter((t) => t.userId === u.id);
            return (
              <View key={u.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderColor: colors.border }}>
                <View><Text style={{ fontWeight: '600', color: colors.text }}>{u.name}</Text><Text style={{ color: colors.muted, fontSize: 12 }}>{u.email}</Text></View>
                <View style={{ alignItems: 'flex-end' }}><Text style={{ color: colors.expense, fontWeight: '700' }}>{money(sum(l, 'expense'))}</Text><Text style={{ color: colors.muted, fontSize: 12 }}>{l.length} txns</Text></View>
              </View>
            );
          })}
        </Card>
      )}
    </ScrollView>
  );
}
