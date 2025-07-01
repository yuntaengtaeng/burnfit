import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomTabParamList } from './src/navigation';
import Home from './src/screens/Home';
import Calendar from './src/screens/Calendar';
import Library from './src/screens/Library';
import MyPage from './src/screens/MyPage';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Tab.Screen name="Home" component={Home} />
              <Tab.Screen name="Calendar" component={Calendar} />
              <Tab.Screen name="Library" component={Library} />
              <Tab.Screen name="MyPage" component={MyPage} />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
  );
}
