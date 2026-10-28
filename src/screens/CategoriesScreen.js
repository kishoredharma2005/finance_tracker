import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { CATEGORIES, colors } from '../theme';
import { money } from '../utils';

export default function CategoriesScreen({ navigation }) {
  const { currentUser, transactions } = useApp();
  const mine = transactions.filter((t) => t.userId === currentUser.id);
  const render = (title, type) => (
    <>
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, marginVertical: 10 }}>{title}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {CATEGORIES.filter((c) => c.type === type).map((c) => {
          const items = mine.filter((t) => t.category === c.name);
          const total = items.reduce((a, t) => a + t.amount, 0);
          return (
            <TouchableOpacity key={c.name} activeOpacity={0.8} onPress={() => navigation.navigate('CategoryDetails', { category: c.name })}
              style={{ width: '48%', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, elevation: 2 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: c.color + '22', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Ionicons name={c.icon} size={22} color={c.color} />
              </View>
              <Text style={{ fontWeight: '700', color: colors.text }}>{c.name}</Text>
              <Text style={{ color: type === 'income' ? colors.income : colors.expense, fontWeight: '800', marginTop: 2 }}>{money(total)}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{items.length} transaction{items.length === 1 ? '' : 's'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
      {render('Expense categories', 'expense')}
      {render('Income categories', 'income')}
    </ScrollView>
  );
}
