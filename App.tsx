import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { BottomTabParamList } from './src/navigation';
import Home from './src/screens/Home';
import Calendar from './src/screens/Calendar';
import Library from './src/screens/Library';
import MyPage from './src/screens/MyPage';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Calendar" component={Calendar} />
        <Tab.Screen name="Library" component={Library} />
        <Tab.Screen name="MyPage" component={MyPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
