import React, { useContext } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Div, Text } from 'react-native-magnus';
import { AuthenticationContext, AuthUser } from '../context/Authentication';
import { Link } from '@react-navigation/native';

export interface RecipeType {
  id?: string
  title: string
  source: string
  recipe: string
}

const Recipe = ({id, title}: RecipeType) => (
  <Link to={id as string}>
    <Div
      mb="md"
      rounded="lg"
    >
      <Text>{title}</Text>
    </Div>
  </Link>
)

export default function RecipesScreen() {
  const value = useContext(AuthenticationContext);
  let user: AuthUser = null;
  if (value) {
    user = value.user;
  }
  let recipes: Array<RecipeType> = []
  React.useEffect(() => {
    const recipesSubscriber = firestore().
      collection('Users').
      doc(user?.uid).
      collection("Recipes").
      onSnapshot((snap) => {
        recipes = snap.docs.map(d => ({...d.data(), id: d.id} as RecipeType))
      });
    return () => recipesSubscriber()
  }, [user])

  return (
    <Div>
      {recipes.map(r => (<Recipe {...r} />))}
    </Div>
  );
}
