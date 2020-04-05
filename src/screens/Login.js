import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView
} from "react-native";

import Button from "library/components/Button";
import CustomText from "library/components/CustomText";
import TextForm from "library/components/TextInput";

import auth from "../library/networking/auth";

class Login extends Component {

  state = {
    mrn: '',
    name: '',
    error: '',
    postal_code: "",
    two_factor: true,
    twoFactorValue: ""
  };

  componentDidMount(): void {
    this.setState({ error: '' });
  }

   _validateUser() {
    auth.signIn(this.state.mrn)
      .then(postal_code => {
        this.setState({ postal_code, two_factor: false, error: "" });
        console.log(postal_code);
      }).catch(err => this.setState({ error: err }))
  }

  async _validateTwoFactor() {
    const { postal_code, twoFactorValue } = this.state;
    if (postal_code.toLowerCase() === twoFactorValue.toLowerCase()) {
      await auth.setKey('mrn', this.state.mrn);
      await auth.setKey('name', this.state.name);
      this.props.navigation.reset({ index: 0, routes: [{ name: 'User' }]});
    }
    else { this.setState({ error: "The postal code you entered was incorrect." }) }
  }

  renderTwoFactor() {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={200}
      >
        <TextForm
          autoFocus
          maxLength={6}
          placeholder="Postal Code"
          value={this.state.twoFactorValue}
          onChangeText={(twoFactorValue) => this.setState({twoFactorValue})}
        />
        <View style={{flexDirection: 'row'}}>
          <Button onPress={() => this.setState({ two_factor: true, error: "", twoFactorValue: "" })} half light title="Cancel" />
          <Button onPress={() => this._validateTwoFactor()} half dark title="Confirm" />
        </View>
      </KeyboardAvoidingView>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.textContainer}>
          <CustomText title label="HeroAI - Patient" />
          <CustomText label="Please enter your full name and your MRN id as found on your SickKids patient bracelet." />
        </View>
        <View style={styles.formContainer}>
          <TextForm
            autoFocus
            editable={this.state.two_factor}
            placeholder="Full name"
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
          />
          <TextForm
            placeholder="MRN number..."
            editable={this.state.two_factor}
            onChangeText={(mrn) => this.setState({mrn})}
            value={this.state.mrn}
          />
          {
            !this.state.two_factor
            ? this.renderTwoFactor()
            : <Button dark title="Submit" onPress={() => this._validateUser()} />
          }

          <CustomText subtitle_2 label={this.state.error} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    marginBottom: '3%',
    marginLeft: '10%'
  },
  formContainer: {
    flex: 5,
    alignItems: 'center'
  },
});

export default Login;
