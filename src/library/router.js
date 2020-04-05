import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import Login from "../screens/Login";
import Home from "../screens/Home";
import Journey from "../screens/Journey";

const Stack = createStackNavigator();
const Root = createStackNavigator();
const Tab = createBottomTabNavigator();

function Authenticate() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyle: { backgroundColor: "#FFFFFF" },
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login}/>
    </Stack.Navigator>
  );
}

function User() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Journey" component={Journey}/>
    </Tab.Navigator>
  )
}

function createRootNavigator(signedIn) {
  return (
    <Root.Navigator
      initialRouteName={signedIn ? "User" : "Login"}
      screenOptions={{
        headerShown: false
      }}
    >
      <Root.Screen name="Login" component={Authenticate}/>
      <Root.Screen name="User" component={User}/>
    </Root.Navigator>
  )
}

export {createRootNavigator}
