import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const RootStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tabs = createBottomTabNavigator();
const CatStack = createNativeStackNavigator();
const ProfStack = createNativeStackNavigator();
const noHeader = { headerShown: false };

// Stack inside the Categories tab: Categories -> Category Details
function CategoriesStack() {
  return (
    <CatStack.Navigator screenOptions={noHeader}>
      <CatStack.Screen name="CategoriesList" component={CategoriesScreen} />
      <CatStack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
    </CatStack.Navigator>
  );
}
// Stack inside the Profile drawer item: Profile -> Edit Profile
function ProfileStack() {
  return (
    <ProfStack.Navigator screenOptions={noHeader}>
      <ProfStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfStack.Navigator>
  );
}
// Bottom tabs for the customer
function CustomerTabs() {
  const icons = { Home: 'home', Transactions: 'swap-vertical', Categories: 'grid', Analysis: 'stats-chart' };
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      headerShown: false, tabBarActiveTintColor: colors.primary,
      tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} size={size} color={color} />,
    })}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Transactions" component={TransactionsScreen} />
      <Tabs.Screen name="Categories" component={CategoriesStack} />
      <Tabs.Screen name="Analysis" component={AnalysisScreen} />
    </Tabs.Navigator>
  );
}
function DrawerContent(props) {
  const { currentUser, signOut } = useApp();
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 18, backgroundColor: colors.primary, marginTop: -4, marginBottom: 8 }}>
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>{currentUser.name}</Text>
        <Text style={{ color: '#CDE7E4', textTransform: 'capitalize' }}>{currentUser.role} • {currentUser.email}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />} onPress={signOut} />
    </DrawerContentScrollView>
  );
}
// Drawer: different menu for Admin and Customer
function MainDrawer() {
  const { currentUser } = useApp();
  const isAdmin = currentUser.role === 'admin';
  const icon = (name) => ({ drawerIcon: ({ color, size }) => <Ionicons name={name} size={size} color={color} /> });
  return (
    <Drawer.Navigator drawerContent={(p) => <DrawerContent {...p} />}
      screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: '#fff', drawerActiveTintColor: colors.primary }}>
      {isAdmin ? (
        <Drawer.Screen name="AdminAnalysis" component={AnalysisScreen} options={{ title: 'Admin Analysis', ...icon('stats-chart') }} />
      ) : (
        <>
          <Drawer.Screen name="Dashboard" component={CustomerTabs} options={{ title: 'Finance Tracker', drawerLabel: 'Dashboard', ...icon('speedometer') }} />
          <Drawer.Screen name="Profile" component={ProfileStack} options={icon('person-circle')} />
        </>
      )}
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { ready, currentUser } = useApp();
  if (!ready) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color={colors.primary} /></View>;
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {currentUser ? (
          <RootStack.Screen name="Main" component={MainDrawer} options={noHeader} />
        ) : (
          <>
            <RootStack.Screen name="Welcome" component={WelcomeScreen} options={noHeader} />
            <RootStack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign In',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
            <RootStack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                title: 'Sign Up',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: '700' },
              }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
