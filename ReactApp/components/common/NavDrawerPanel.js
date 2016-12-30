import React from 'react';
import {PropTypes} from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Actions } from 'react-native-router-flux';

const NavDrawerPanel = (props, context) => {
  const drawer = context.drawer;
  return (
    <View style={styles.container}>
      <TouchableHighlight>
        <Text>Home</Text>
      </TouchableHighlight>
      <TouchableHighlight>
        <Text>Profile</Text>
      </TouchableHighlight>
      <TouchableHighlight>
        <Text>Friends</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'black'
  },
})