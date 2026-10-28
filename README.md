# Finance Budget Tracker (React Native / Expo)

## Run
npm install
npx expo start      # scan QR with Expo Go (phone) or press a for Android emulator

## Demo logins
Customer: demo@fin.com / Demo@123   (has sample data)
Admin:    admin@fin.com / Admin@123
(You can also Sign Up as Customer or Admin.)

## Rubric mapping
1 Home (Sign up / Sign in, Admin + Customer) ... src/screens/WelcomeScreen, SignInScreen, SignUpScreen
2 Analysis (Admin + Customer) ................ src/screens/AnalysisScreen
3 Profile + Edit Profile (Customer) .......... ProfileScreen, EditProfileScreen
4 Transactions month-wise (Customer) ......... TransactionsScreen
5 Overall Categories (Customer) .............. CategoriesScreen
6 Category Details (Customer) ................ CategoryDetailsScreen
Navigation: Stack (auth flow, Categories->Details, Profile->Edit), Bottom Tabs (customer), Drawer (admin + customer) ... src/navigation/index.js
Functional: all screens reachable; personalized alert on add/edit/delete transaction (AppContext.notify) and profile update;
            Daily/Weekly/Monthly reports on Home (HomeScreen)
Validation on every form. No backend: data kept locally with AsyncStorage.
