import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  Text
} from 'react-native';

import R from "res/R";

const screenWidth = Math.round(Dimensions.get('window').width);

const Button = ({
  title,
  ...restProps
}) => {

  return (
    <TouchableOpacity {...restProps}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
};

const ActionTab = ({
  item,
  openModal,
  ...restProps
}) => {

  const colors = [ "#64b0ff", "#ff4e44", "#ffd825", "#1fbe13", "#bcbcbc" ];

  const timeContainer = {
    flex: 1,
    height: 65,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: colors[item.ctas - 1]
  };

  return (
    <View style={styles.actionContainer}>
      {/*<View style={timeContainer} />*/}
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.sender}>{item.sender}</Text>
          <Text style={styles.subtitle2}>{item.timestamp}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.subtitle1}>{item.body}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button {...restProps} title="More" />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  actionContainer: {
    flex: 1,
    height: 80,
    marginTop: "2%",
    paddingBottom: "4%",
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    width: screenWidth * 0.8,
    borderBottomColor: "rgba(74,74,74,0.27)"
  },
  infoContainer: {
    flex: 8,
    marginRight: '6%',
    justifyContent: 'center',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'flex-end'
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60
  },
  buttonText: {
    fontFamily: R.fonts.robotoBlack,
    fontSize: 12,
    textTransform: 'uppercase',
    color: 'white'
  },
  subtitle2: {
    fontFamily: R.fonts.robotoBlack,
    fontSize: 13
  },
  subtitle1: {
    fontFamily: R.fonts.comfortaaLight,
    fontSize: 14
  },
  sender: {
    fontFamily: R.fonts.robotoBlack,
    textTransform: 'capitalize',
    fontSize: 13
  },
  title: {
    fontFamily: R.fonts.comfortaaBold,
    fontSize: 16
  }
});

export default ActionTab;
