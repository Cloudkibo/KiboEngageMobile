/**
 * Style Guide
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import {
  View,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TabViewAnimated, TabBarTop } from 'react-native-tab-view';
import { Tabs, Tab, Icon } from 'react-native-elements'

import { List, ListItem, SocialIcon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Teams from './Teams';
import CreateTeam from './CreateTeam';
import MyTeams from './MyTeams';
import auth from '../../services/auth';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import { Alerts, Button, Card, Spacer, Text } from '@components/ui/';

// Example Data
/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary,
  },
  tabbarIndicator: {
    backgroundColor: '#FFF',
  },
  tabbar_text: {
    color: '#FFF',
  },
});

/* Component ==================================================================== */
class TeamsMain extends Component {
  static componentName = 'TeamsMain';

   constructor(props) {
          super(props);
         this.state = {
           selectedTab: 'teams',
          }
  }

  changeTab (selectedTab) {
  this.setState({selectedTab})
}

 render = () => {
    const { selectedTab } = this.state;

 
    
    return(
        <Tabs>
                <Tab
                  titleStyle={{fontWeight: 'bold', fontSize: 10}}
                  selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
                  selected={selectedTab === 'myTeam'}
                  title={'My Teams'}
                  renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='group' size={33} />}
                  renderSelectedIcon={() => <Icon color={'#6296f9'} name='team-add' size={30} />}
                  onPress={() => this.changeTab('myTeam')}>
                  <MyTeams />
                </Tab>
                <Tab
                  titleStyle={{fontWeight: 'bold', fontSize: 10}}
                  selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
                  selected={selectedTab === 'teams'}
                  title={'Search Team'}
                  renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='search' size={33} />}
                  renderSelectedIcon={() => <Icon color={'#6296f9'} name='search' size={30} />}
                  onPress={() => this.changeTab('teams')}>
                  <Teams />
                </Tab>
                <Tab
                  titleStyle={{fontWeight: 'bold', fontSize: 10}}
                  selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
                  selected={selectedTab === 'createTeam'}
                  title={'Create Team'}
                  renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='group-add' size={33} />}
                  renderSelectedIcon={() => <Icon color={'#6296f9'} name='team-add' size={30} />}
                  onPress={() => this.changeTab('createTeam')}>
                  <CreateTeam />
                </Tab>

              </Tabs>
 
  );
}
}



export default TeamsMain;

