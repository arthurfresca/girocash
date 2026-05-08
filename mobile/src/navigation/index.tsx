import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import { useTranslation } from 'react-i18next'

import { DashboardScreen } from '../screens/DashboardScreen'
import { WorkdaysScreen } from '../screens/WorkdaysScreen'
import { FuelScreen } from '../screens/FuelScreen'
import { GoalsScreen } from '../screens/GoalsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const tabs = [
  { name: 'Dashboard', key: 'dashboard' as const, icon: '📊', Screen: DashboardScreen },
  { name: 'Workdays', key: 'workdays' as const, icon: '📅', Screen: WorkdaysScreen },
  { name: 'Fuel', key: 'fuel' as const, icon: '⛽', Screen: FuelScreen },
  { name: 'Goals', key: 'goals' as const, icon: '🎯', Screen: GoalsScreen },
  { name: 'Profile', key: 'profile' as const, icon: '👤', Screen: ProfileScreen },
]

export function AppNavigator() {
  const { t } = useTranslation()

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#f1f5f9',
          headerTitleStyle: { fontWeight: '600' },
          tabBarStyle: {
            backgroundColor: '#1e293b',
            borderTopColor: '#334155',
          },
          tabBarActiveTintColor: '#22c55e',
          tabBarInactiveTintColor: '#94a3b8',
        }}
      >
        {tabs.map(({ name, key, icon, Screen }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={Screen}
            options={{
              title: t(`nav.${key}`),
              tabBarLabel: t(`nav.${key}`),
              tabBarIcon: () => <Text style={{ fontSize: 20 }}>{icon}</Text>,
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  )
}
