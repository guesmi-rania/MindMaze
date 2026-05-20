import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { Text } from 'react-native'

import { useAuthStore } from './src/store/authStore'
import { COLORS } from './src/utils/theme'

import LoginScreen      from './src/screens/LoginScreen'
import HomeScreen       from './src/screens/HomeScreen'
import GameScreen       from './src/screens/GameScreen'
import LeaderboardScreen from './src/screens/LeaderboardScreen'
import ProfileScreen    from './src/screens/ProfileScreen'

const Stack = createNativeStackNavigator()
const Tab   = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bgCard,
          borderTopColor: COLORS.border,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: COLORS.accentLight,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Accueil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ tabBarLabel: 'Classement', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏆</Text> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  const { isAuthenticated, loadUser } = useAuthStore()

  useEffect(() => { loadUser() }, [])

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated
          ? <Stack.Screen name="Login" component={LoginScreen} />
          : (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen
                name="Game"
                component={GameScreen}
                options={{ animation: 'slide_from_bottom' }}
              />
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}