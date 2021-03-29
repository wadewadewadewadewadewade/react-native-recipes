import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import { Text } from 'react-native-magnus';
import { AuthenticationContext } from '../context/Authentication';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <AuthenticationContext.Consumer>
      {(value) => {
        if (value && value.user && value?.user?.emailVerified) {
          return (
            <NavigationContainer
              linking={LinkingConfiguration}
              theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <RootNavigator />
            </NavigationContainer>
          )
        } else if (value && value.user) {
          return (<Text>Please verify your email address by clicking the link in the email you were sent.</Text>)
        } else {
          return null
        }
      }}
    </AuthenticationContext.Consumer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
