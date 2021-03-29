import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const statusBarHeight = 100;

const tabsHeight = 125

export default {
  window: {
    width,
    height,
  },
  statusBarHeight,
  tabsHeight,
  isSmallDevice: width < 375,
};
