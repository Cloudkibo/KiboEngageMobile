import React, { Component } from 'react';
//import { Text } from 'react-native';
//import { Actions } from 'react-native-router-flux';
import { View,Text} from 'react-native';
import AppStyles from '../styles'
import AppConfig from '../config'
import AppUtil from '../util'

import { connect } from 'react-redux';
import { emailChanged,domainChanged, passwordChanged, loginUser } from '../actions';
import { Card, CardSection, Input, Spinner ,Button} from './common';
//import {Button,Icon,View,Text} from '@shoutem/ui'
import TeamList from './TeamList'

class Dashboard extends Component {
  static componentName = 'Dashboard';
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
  }
   onTeams(){
  //  Actions.teams();
   this.props.navigator.push({
            title: 'Teams',
            component: TeamList,
            index: 2           
          });
  }

  render() {
    return (
      <View style={[AppStyles.container, AppStyles.containerCentered]}>
        <Text style={styles.errorTextStyle}>
          Welcome to Dashboard

        </Text>

        <Button styleName="full-width muted" onPress={this.onTeams.bind(this)}>
               <Text>Teams</Text>
            </Button>
       
      </View>
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

