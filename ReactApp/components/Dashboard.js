import React, { Component } from 'react';
//import { Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { emailChanged,domainChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Spinner } from './common';
import {Button,Icon,View,Text} from '@shoutem/ui'

class Dashboard extends Component {
    

  render() {
    return (
      <Card>
      
        <Text style={styles.errorTextStyle}>
          Welcome to Dashboard
        </Text>

       
      </Card>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  }
};



export default Dashboard;

