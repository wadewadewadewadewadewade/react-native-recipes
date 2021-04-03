import React, { createContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Button, Div, Input, Text } from 'react-native-magnus';

export type AuthUser = FirebaseAuthTypes.User | null;
export const AuthenticationContext = createContext<{user: AuthUser, initializing: boolean} | null>(null);

const SignInOrUp = () => {
  const [isRegister, changeMode] = useState(false)
  const [email, onChangeEmail] = useState<string | undefined>(undefined)
  const [password, onChangePassword] = useState<string | undefined>(undefined)
  const [error, showError] = useState<string | undefined>(undefined)

  const signIn = async () => {
    if (email && password) {
      try {
        await auth().signInWithEmailAndPassword(email, password);
      } catch (err) {
        showError(`${err.code}: ${err.message}`)
      }
    } else {
      showError('Email and/or Password not provided')
    }
  }

  const signUp = async () => {
    if (email) {
      try {
        const actionCodeSettings = {
          // URL you want to redirect back to. The domain (www.example.com) for this
          // URL must be in the authorized domains list in the Firebase Console.
          url: 'https://recipes-b7a65.web.app',
          // This must be true.
          handleCodeInApp: true,
          iOS: {
            bundleId: 'com.aproximation.recipes'
          },
          android: {
            packageName: 'com.aproximation.recipes',
            installApp: true,
            minimumVersion: '21'
          },
          dynamicLinkDomain: 'recipes.page.link'
        }
        await auth().sendSignInLinkToEmail(email, actionCodeSettings)
      } catch (err) {
        showError(`${err.code}: ${err.message}`)
      }
    } else {
      showError('Email not provided')
    }
  }

  return (
    <Div m="md">
      {!isRegister ? (
        <Text fontWeight="bold" fontSize="xl">Sign Into Existing Account:</Text>
      ) : (
        <Text fontWeight="bold">Sign Up With New Account:</Text>
      )}
      {error && (<Text bg="red" rounded="md" my="lg" p="md" fontSize="lg">{error}</Text>)}
      <Input
        placeholder="Email"
        autoCompleteType="email"
        value={email}
        onChangeText={(t) => {
          onChangeEmail(t)
          showError(undefined)
        }}
        my="lg"
        onEndEditing={() => isRegister ? signUp() : signIn()}
      />
      {!isRegister && (
        <Input
          placeholder="Password"
          autoCompleteType="password"
          secureTextEntry
          value={password}
          onChangeText={(t) => {
            onChangePassword(t)
            showError(undefined)
          }}
          onEndEditing={() => signIn()}
          mb="lg"
        />
      )}
      {isRegister ? (
        <Button
          block
          rounded="md"
          bg="buttonAlternativeBg"
          onPress={() => changeMode(false)}
        >
          <Text
            fontSize="xl"
            color="buttonAlternative"
          >Sign In To Existing Account</Text>
        </Button>
      ) : (
        <Button
          block
          rounded="md"
          bg="buttonAlternativeBg"
          onPress={() => changeMode(true)}
        >
          <Text
            fontSize="xl"
            color="buttonAlternative"
          >Create New Account Instead</Text>
        </Button>
      )}
    </Div>
  )
}

const AuthenticaitonProvider = ({ children } : { children: JSX.Element | null }) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<AuthUser>(null);

  // Handle user state changes
  function onAuthStateChanged(u: AuthUser) {
    setUser(u);
    if (initializing) setInitializing(false)
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{user, initializing}}
    >
      {user ? null : (
        <SignInOrUp />
      )}
      {children}
    </AuthenticationContext.Provider>
  )
}

export default AuthenticaitonProvider