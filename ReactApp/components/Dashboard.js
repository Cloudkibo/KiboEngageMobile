import React, { Component } from 'react';
//import { Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { connect } from 'react-redux';
import { emailChanged,domainChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Spinner } from './common';
import {Button,Icon,View,Text} from '@shoutem/ui'

class Dashboard extends Component {
    
   onTeams(){
    Actions.teams();
  }

  render() {
    return (
      <Card>
      
        <Text style={styles.errorTextStyle}>
          Welcome to Dashboard

        </Text>

        <Button styleName="full-width muted" onPress={this.onTeams.bind(this)}>
              <Icon name="ic_user_profile" />
              <Text>Teams</Text>
            </Button>
       
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

