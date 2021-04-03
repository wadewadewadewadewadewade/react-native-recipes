import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { ThemeProvider } from 'react-native-magnus';
import AuthenticationContextProvider from './context/Authentication'
import StorageContextProvider from './context/Authentication'

const ElarnTheme = {
  colors: {
    buttonPrimary: '#FF44EE',
    buttonPrimaryBg: '#FFF',
    buttonSecondary: '#EEE',
    buttonSecondaryBg: '#999',
    buttonAlternative: '#999',
    buttonAlternativeBg: '#FFF'
  }
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <ThemeProvider theme={ElarnTheme}>
          <AuthenticationContextProvider>
            <StorageContextProvider>
              <Navigation colorScheme={colorScheme} />
            </StorageContextProvider>
          </AuthenticationContextProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }
}
