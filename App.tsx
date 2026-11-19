import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/components/ui';
import type { RootStackParamList, TabParamList } from './src/navigation/types';
import ApprovedDetailScreen from './src/screens/ApprovedDetailScreen';
import ApprovedListScreen from './src/screens/ApprovedListScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import PricingScreen from './src/screens/PricingScreen';
import SummaryScreen from './src/screens/SummaryScreen';
import TemplatesScreen from './src/screens/TemplatesScreen';
import { AppStoreProvider } from './src/store/AppStore';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const tabIcons: Record<keyof TabParamList, string> = {
  Pricing: '🧮',
  Templates: '📋',
  Catalog: '📦',
  Approved: '✅',
};

function TabIcon({
  name,
  focused,
}: {
  name: keyof TabParamList;
  focused: boolean;
}) {
  return (
    <Text style={[styles.tabIcon, !focused && styles.tabIconInactive]}>
      {tabIcons[name]}
    </Text>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ focused }) => TabIcon({ name: route.name, focused }),
      })}
    >
      <Tab.Screen
        name="Pricing"
        component={PricingScreen}
        options={{ title: 'Precificação' }}
      />
      <Tab.Screen
        name="Templates"
        component={TemplatesScreen}
        options={{ title: 'Modelos' }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{ title: 'Cadastros' }}
      />
      <Tab.Screen
        name="Approved"
        component={ApprovedListScreen}
        options={{ title: 'Aprovadas' }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppStoreProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Summary"
              component={SummaryScreen}
              options={{ title: 'Resumo' }}
            />
            <Stack.Screen
              name="ApprovedDetail"
              component={ApprovedDetailScreen}
              options={{ title: 'Precificação aprovada' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  tabIcon: { fontSize: 18 },
  tabIconInactive: { opacity: 0.5 },
});
