import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Button from "../library/components/Button";

import message from "../library/services/notifications";
import auth from "../library/networking/auth";

class Journey extends React.Component {
  state = {};
  componentDidMount(): void {}

  async signOut() {
    await message.removeToken();
    await auth.removeKey('mrn');
    await auth.removeKey('name');
    this.props.navigation.replace('Login')
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text>Chat Page</Text>
        <Button dark title="Log Out" onPress={() => this.signOut()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default Journey;
