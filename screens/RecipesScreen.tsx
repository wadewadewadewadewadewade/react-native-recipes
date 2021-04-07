import React from 'react';
import {Div, Text} from 'react-native-magnus';
import {Link} from '@react-navigation/native';
import {StorageContext} from '../context/Storage';

export interface RecipeType {
  id?: string;
  title: string;
  source: string;
  recipe: string;
}

const Recipe = ({id, title}: RecipeType) => (
  <Link to={id as string}>
    <Div mb="md" rounded="lg">
      <Text>{title}</Text>
    </Div>
  </Link>
);

export default function RecipesScreen() {
  return (
    <StorageContext.Consumer>
      {(value) => {
        if (value && value.list) {
          return (
            <Div>
              {value
                .list()
                .then((recipes) =>
                  recipes.map((recipe) => <Recipe {...recipe} />),
                )}
            </Div>
          );
        } else {
          return <Text>Please select a data source.</Text>;
        }
      }}
    </StorageContext.Consumer>
  );
}
