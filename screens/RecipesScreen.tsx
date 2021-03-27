import * as React from 'react';

import EditScreenInfo from '../components/EditScreenInfo';
import { Div } from 'react-native-magnus';

export default function RecipesScreen() {
  return (
    <Div>
      <EditScreenInfo path="/screens/RecipesScreen.tsx" />
    </Div>
  );
}
