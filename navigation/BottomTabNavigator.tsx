import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import RecipesScreen from '../screens/RecipesScreen';
import CaptureScreen from '../screens/CaptureScreen';
import { BottomTabParamList, RecipesParamList, CaptureParamList } from '../types';
import { Keyboard } from 'react-native';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const [visible, setVisibility] = React.useState<boolean>(true);

  Keyboard.addListener('keyboardDidShow', () => {
    setVisibility(false)
  })
  Keyboard.addListener('keyboardDidHide', () => {
    setVisibility(true)
  })

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        showLabel: false,
        style: visible ? {
          marginLeft: 100,
          marginRight: 100,
          marginBottom: 30,
          borderRadius: 35,
          paddingTop: 10,
          paddingBottom: 10,
          borderTopWidth: 0,
          position: 'absolute',
          paddingHorizontal: 20,
          //backgroundColor: Colors[colorScheme].tabBarBackground,
        } : {
          display: 'none'
        }
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={25} name="notebook" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={25} name="camera" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<RecipesParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="RecipesScreen"
        component={RecipesScreen}
        options={{ headerTitle: 'Recipes' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<CaptureParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="CaptureScreen"
        component={CaptureScreen}
        options={{ headerTitle: 'Capture' }}
      />
    </TabTwoStack.Navigator>
  );
}
