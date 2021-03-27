import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const statusBarHeight = 75;

export default {
  window: {
    width,
    height,
  },
  statusBarHeight,
  isSmallDevice: width < 375,
};
