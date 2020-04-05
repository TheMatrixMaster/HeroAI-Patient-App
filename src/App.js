import * as React from 'react';

import {NavigationContainer} from "@react-navigation/native";
import {createRootNavigator} from "./library/router";

import SplashScreen from "./screens/SplashScreen";
import auth from "./library/networking/auth";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };

  }

  splashDelay = async() => {
    return new Promise((resolve) =>
      setTimeout(() => { resolve('result') }, 1500 )
    )
  };

  async componentDidMount() {
    await this.splashDelay();

    auth.isSignedIn('mrn')
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert(err.message));
  }

  render() {
    const { checkedSignIn, signedIn } = this.state;

    return (
      <NavigationContainer>
        { !checkedSignIn ? <SplashScreen/> : createRootNavigator(signedIn) }
      </NavigationContainer>
    )
  }

}
