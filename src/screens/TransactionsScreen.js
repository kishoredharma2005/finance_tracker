import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Empty, Input, Segmented } from '../components/ui';
import TxRow from '../components/TxRow';
import { useApp } from '../context/AppContext';
import { CATEGORIES, colors } from '../theme';
import { isValidDate, money, monthKey, monthLabel, shiftMonth, sum, todayISO } from '../utils';

const blank = () => ({ type: 'expense', amount: '', category: '', note: '', date: todayISO() });

export default function TransactionsScreen({ route, navigation }) {
  const { currentUser, transactions, addTransaction, updateTransaction, deleteTransaction } = useApp();
  const [month, setMonth] = useState(monthKey(todayISO()));
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(blank());
  const [errors, setErrors] = useState({});

  const openAdd = () => { setEditId(null); setForm(blank()); setErrors({}); setOpen(true); };
  useEffect(() => {
    if (route.params?.openAdd) { openAdd(); navigation.setParams({ openAdd: false }); }
  }, [route.params?.openAdd]);

  const list = transactions.filter((t) => t.userId === currentUser.id && monthKey(t.date) === month).sort((a, b) => (a.date < b.date ? 1 : -1));
  const inc = sum(list, 'income'); const exp = sum(list, 'expense');

  const openEdit = (t) => { setEditId(t.id); setForm({ type: t.type, amount: String(t.amount), category: t.category, note: t.note, date: t.date }); setErrors({}); setOpen(true); };
  const save = () => {
    const e = {}; const amt = Number(form.amount);
    if (!form.amount.trim() || isNaN(amt) || amt <= 0) e.amount = 'Enter an amount greater than 0';
    else if (amt > 10000000) e.amount = 'Amount is too large';
    if (!form.category) e.category = 'Select a category';
    if (!isValidDate(form.date)) e.date = 'Use a valid date (YYYY-MM-DD)';
    else if (form.date > todayISO()) e.date = 'Date cannot be in the future';
    if (form.note.length > 40) e.note = 'Max 40 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    const data = { type: form.type, amount: amt, category: form.category, note: form.note.trim(), date: form.date };
    setOpen(false);
    if (editId) updateTransaction(editId, data); else addTransaction(data);
    setMonth(monthKey(data.date));
  };
  const confirmDelete = (t) => Alert.alert('Delete transaction', 'Are you sure you want to delete this transaction?', [
    { text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(t.id) }]);

  const cats = CATEGORIES.filter((c) => c.type === form.type);
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 90 }}
        data={list}
        keyExtractor={(t) => t.id}
        ListHeaderComponent={
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <TouchableOpacity onPress={() => setMonth(shiftMonth(month, -1))}><Ionicons name="chevron-back-circle" size={34} color={colors.primary} /></TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>{monthLabel(month)}</Text>
              <TouchableOpacity onPress={() => setMonth(shiftMonth(month, 1))}><Ionicons name="chevron-forward-circle" size={34} color={colors.primary} /></TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <Card style={{ flex: 1, marginBottom: 0 }}><Text style={{ color: colors.muted }}>Income</Text><Text style={{ color: colors.income, fontWeight: '800', fontSize: 17 }}>{money(inc)}</Text></Card>
              <Card style={{ flex: 1, marginBottom: 0 }}><Text style={{ color: colors.muted }}>Expense</Text><Text style={{ color: colors.expense, fontWeight: '800', fontSize: 17 }}>{money(exp)}</Text></Card>
            </View>
            <Text style={{ color: colors.muted, marginBottom: 10, fontSize: 12 }}>Tap a transaction to edit • use the bin to delete</Text>
          </>
        }
        ListEmptyComponent={<Empty text="No transactions in this month." />}
        renderItem={({ item }) => <TxRow tx={item} onPress={() => openEdit(item)} onDelete={() => confirmDelete(item)} />}
      />
      <TouchableOpacity onPress={openAdd} style={{ position: 'absolute', right: 20, bottom: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 5 }}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 20, paddingTop: 50 }} keyboardShouldPersistTaps="handled">
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 16 }}>{editId ? 'Edit' : 'Add'} transaction</Text>
          <Segmented value={form.type} onChange={(v) => setForm({ ...form, type: v, category: '' })} options={[{ label: 'Expense', value: 'expense' }, { label: 'Income', value: 'income' }]} />
          <Input label="Amount (₹)" value={form.amount} onChangeText={(v) => setForm({ ...form, amount: v })} keyboardType="decimal-pad" placeholder="0" error={errors.amount} />
          <Text style={{ fontWeight: '600', color: colors.text, marginBottom: 8 }}>Category</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
            {cats.map((c) => (
              <TouchableOpacity key={c.name} onPress={() => setForm({ ...form, category: c.name })}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: form.category === c.name ? c.color : '#fff', borderWidth: 1, borderColor: c.color }}>
                <Ionicons name={c.icon} size={15} color={form.category === c.name ? '#fff' : c.color} />
                <Text style={{ marginLeft: 6, color: form.category === c.name ? '#fff' : colors.text }}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!!errors.category && <Text style={{ color: colors.expense, fontSize: 12, marginBottom: 8 }}>{errors.category}</Text>}
          <View style={{ height: 8 }} />
          <Input label="Date (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm({ ...form, date: v })} placeholder="2026-10-28" error={errors.date} />
          <Input label="Note (optional)" value={form.note} onChangeText={(v) => setForm({ ...form, note: v })} autoCapitalize="sentences" placeholder="e.g. Lunch" error={errors.note} />
          <Button title={editId ? 'Save changes' : 'Add transaction'} onPress={save} />
          <Button title="Cancel" variant="outline" onPress={() => setOpen(false)} style={{ marginTop: 10 }} />
        </ScrollView>
      </Modal>
    </View>
  );
}
