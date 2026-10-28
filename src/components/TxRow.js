import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { catInfo, colors } from '../theme';
import { money } from '../utils';

export default function TxRow({ tx, onPress, onDelete }) {
  const c = catInfo(tx.category);
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: 12, borderRadius: 14, marginBottom: 10 }}>
      <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.color + '22', alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name={c.icon} size={20} color={c.color} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontWeight: '700', color: colors.text }}>{tx.category}</Text>
        <Text style={{ color: colors.muted, fontSize: 12 }}>{tx.note ? tx.note + ' • ' : ''}{tx.date}</Text>
      </View>
      <Text style={{ fontWeight: '700', color: tx.type === 'income' ? colors.income : colors.expense }}>
        {tx.type === 'income' ? '+' : '-'}{money(tx.amount)}
      </Text>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={{ marginLeft: 10 }}>
          <Ionicons name="trash-outline" size={20} color={colors.expense} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
