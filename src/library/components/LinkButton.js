import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text
} from 'react-native';

import R from "res/R";

const fontFamily = R.fonts.comfortaaRegular;

const LinkButton = ({
  title,
  header,
  underline,
  customStyle,
  ...restProps
}) => {

  let textStyle = [];
  textStyle = textStyle.concat(style.defaultStyle);

  if (header) { textStyle = textStyle.concat(style.header) }
  if (underline) { textStyle = textStyle.concat(style.underline) }

  return (
    <TouchableOpacity {...restProps}>
      <View>
        <Text style={textStyle}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
};

const style = StyleSheet.create({
  defaultStyle: {
    fontFamily,
  },
  header: {
    fontFamily: R.fonts.comfortaaBold,
    color: "#007AFF",
    fontSize: 17
  },
  underline: {
    color: R.colors.primary,
    fontSize: 13,
    textDecorationLine: 'underline',
    marginTop: '3%'
  }
});

export default LinkButton;

