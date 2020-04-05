import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native';

import R from "res/R";

const screenWidth = Math.round(Dimensions.get('window').width);

const height = 50;
const padding = 10;
const margin = 10;
const width = screenWidth * 0.8;
const backgroundColor = R.colors.primary;
const borderRadius = 6;
const color = R.colors.primary;

const Button = ({
  title,
  dark,
  light,
  noBorder,
  half,
  customStyle,
  ...restProps
}) => {

  let inlineStyle = [];
  let textStyle = [];

  inlineStyle = inlineStyle.concat(style.defaultStyle);
  textStyle = textStyle.concat(style.defaultTextStyle);

  if (dark) { textStyle = textStyle.concat(style.lightText) }
  if (light) { inlineStyle = inlineStyle.concat(style.light) }
  if (noBorder) { inlineStyle = inlineStyle.concat(style.noBorder) }
  if (half) {inlineStyle = inlineStyle.concat(style.half)}
  if (customStyle) { inlineStyle = inlineStyle.concat(customStyle) }

  return (
    <TouchableOpacity {...restProps}>
      <View style={inlineStyle}>
        <Text style={textStyle}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
};

const style = StyleSheet.create({
  defaultStyle: {
    height,
    padding,
    margin,
    width,
    backgroundColor,
    borderRadius,
    borderColor: backgroundColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  defaultTextStyle: {
    fontFamily: R.fonts.robotoBlack,
    textTransform: 'uppercase',
    fontSize: 13,
    color
  },
  lightText: {
    color: R.colors.secondary
  },
  light: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  noBorder: {
    borderWidth: 0
  },
  half: {
    width: screenWidth * 0.75 / 2
  }
});

export default Button;