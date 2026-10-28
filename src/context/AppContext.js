import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { money, monthKey, toISO, todayISO } from '../utils';

const KEY = 'finance_tracker_v1';
const ADMIN = { id: 'admin-1', role: 'admin', name: 'Admin', email: 'admin@fin.com', phone: '9999999999', password: 'Admin@123' };
const DEMO = { id: 'cust-demo', role: 'customer', name: 'Demo Customer', email: 'demo@fin.com', phone: '9876543210', password: 'Demo@123' };

function seedTransactions() {
  const rows = [
    ['income', 'Salary', 40000, 'Monthly salary', 1], ['expense', 'Bills', 3200, 'Electricity & internet', 3],
    ['expense', 'Food', 450, 'Lunch with friends', 5], ['expense', 'Transport', 300, 'Bus pass top-up', 6],
    ['expense', 'Shopping', 2100, 'Shoes', 9], ['expense', 'Entertainment', 600, 'Movie night', 12],
    ['expense', 'Health', 800, 'Pharmacy', 15], ['income', 'Freelance', 5000, 'UI design gig', 18],
    ['expense', 'Food', 380, 'Groceries', 20], ['expense', 'Other', 250, 'Gift', 24],
  ];
  const out = []; const now = new Date();
  [0, 1, 2].forEach((back) => {
    rows.forEach(([type, category, amount, note, day], i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - back, day);
      if (toISO(d) > todayISO()) return;
      out.push({ id: `seed-${back}-${i}`, userId: DEMO.id, type, category, amount, note, date: toISO(d) });
    });
  });
  out.push({ id: 'seed-today', userId: DEMO.id, type: 'expense', category: 'Food', amount: 220, note: 'Breakfast', date: todayISO() });
  return out;
}

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [state, setState] = useState({ users: [ADMIN, DEMO], transactions: seedTransactions(), currentUserId: null });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setState(JSON.parse(raw));
      } catch (e) {}
      setReady(true);
    })();
  }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {}); }, [state, ready]);

  const currentUser = state.users.find((u) => u.id === state.currentUserId) || null;

  const signUp = ({ name, email, phone, password, role }) => {
    if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, error: 'An account with this email already exists.' };
    const user = { id: 'u-' + Date.now(), role, name, email, phone, password };
    setState((s) => ({ ...s, users: [...s.users, user], currentUserId: user.id }));
    return { ok: true };
  };
  const signIn = (email, password, role) => {
    const u = state.users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.role === role);
    if (!u) return { ok: false, error: `No ${role} account found with this email.` };
    if (u.password !== password) return { ok: false, error: 'Incorrect password.' };
    setState((s) => ({ ...s, currentUserId: u.id }));
    return { ok: true };
  };
  const signOut = () => setState((s) => ({ ...s, currentUserId: null }));

  const updateProfile = ({ name, email, phone }) => {
    if (state.users.some((u) => u.id !== currentUser.id && u.email.toLowerCase() === email.toLowerCase())) return { ok: false, error: 'This email is used by another account.' };
    setState((s) => ({ ...s, users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, name, email, phone } : u)) }));
    Alert.alert('Profile updated', `Hi ${name}, your profile details were saved successfully.`);
    return { ok: true };
  };

  // Personalized alert shown on every change in transactions
  const monthSpend = (list, uid, month) =>
    list.filter((t) => t.userId === uid && t.type === 'expense' && monthKey(t.date) === month).reduce((a, t) => a + t.amount, 0);
  const notify = (verb, tx, list) => {
    const spend = monthSpend(list, currentUser.id, monthKey(tx.date));
    Alert.alert(
      `Transaction ${verb}`,
      `Hi ${currentUser.name}, your ${tx.type} of ${money(tx.amount)} in ${tx.category} (${tx.date}) was ${verb}.\n\nYour total spending for this month is now ${money(spend)}.`
    );
  };
  const addTransaction = (data) => {
    const tx = { ...data, id: 't-' + Date.now() + Math.random().toString(36).slice(2, 6), userId: currentUser.id };
    const list = [...state.transactions, tx];
    setState((s) => ({ ...s, transactions: list }));
    notify('added', tx, list);
  };
  const updateTransaction = (id, data) => {
    const list = state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t));
    setState((s) => ({ ...s, transactions: list }));
    notify('updated', data, list);
  };
  const deleteTransaction = (id) => {
    const tx = state.transactions.find((t) => t.id === id);
    const list = state.transactions.filter((t) => t.id !== id);
    setState((s) => ({ ...s, transactions: list }));
    notify('deleted', tx, list);
  };

  const value = { ready, users: state.users, transactions: state.transactions, currentUser, signUp, signIn, signOut, updateProfile, addTransaction, updateTransaction, deleteTransaction };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
