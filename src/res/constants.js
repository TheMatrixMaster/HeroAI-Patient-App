import {Dimensions} from "react-native";

const constants = {
  screenWidth: Math.round(Dimensions.get('window').width),
  screenHeight: Math.round(Dimensions.get('window').height)
};

export default constants;

