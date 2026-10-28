import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui';
import { colors } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary, padding: 24 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="wallet" size={56} color="#fff" />
        </View>
        <Text style={{ color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 24 }}>Finance Tracker</Text>
        <Text style={{ color: '#D5ECE9', textAlign: 'center', marginTop: 10, fontSize: 15 }}>
          Track income, control spending and reach your budget goals — for customers and admins.
        </Text>
      </View>
      <Button
        title="Sign In"
        onPress={() => navigation.navigate('SignIn')}
        style={{ backgroundColor: '#fff', marginBottom: 12 }}
        textStyle={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}
      />
      <Button
        title="Sign Up"
        variant="outline"
        onPress={() => navigation.navigate('SignUp')}
        style={{ borderColor: '#fff' }}
        textStyle={{ color: '#fff', fontWeight: '700', fontSize: 16 }}
      />
      <Text style={{ color: '#D5ECE9', textAlign: 'center', marginTop: 14, fontSize: 12 }}>Available for Admin and Customer accounts</Text>
    </SafeAreaView>
  );
}
