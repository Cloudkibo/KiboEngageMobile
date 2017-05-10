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
import Groups from './Groups';
//import MyGroups from './Groups';
import CreateGroup from './CreateGroup';
import MyGroups from '../Groups/MyGroups';
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
class GroupsMain extends Component {
  static componentName = 'GroupsMain';

   constructor(props) {
          super(props);
         this.state = {
           selectedTab: 'myGroups',
          }
  }

  changeTab (selectedTab) {
  this.setState({selectedTab})
}

 render = () => {
    const { selectedTab } = this.state;

 
    
    return(
        <Tabs>
                {this.props.userdetails.isAdmin == "Yes" &&
                <Tab
                  titleStyle={{fontWeight: 'bold', fontSize: 10}}
                  selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
                  selected={selectedTab === 'myGroups'}
                  title={'My Groups'}
                  renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='group' size={33} />}
                  renderSelectedIcon={() => <Icon color={'#6296f9'} name='group-add' size={30} />}
                  onPress={() => this.changeTab('myGroups')}>
                  <MyGroups />
                </Tab>
              }
                <Tab
                  titleStyle={{fontWeight: 'bold', fontSize: 10}}
                  selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
                  selected={selectedTab === 'searchGroups'}
                  title={'Search Groups'}
                  renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='search' size={33} />}
                  renderSelectedIcon={() => <Icon color={'#6296f9'} name='search' size={30} />}
                  onPress={() => this.changeTab('searchGroups')}>
                  <Groups />
                </Tab>
                {this.props.userdetails.isAdmin == "Yes" &&
                <Tab
                  titleStyle={{fontWeight: 'bold', fontSize: 10}}
                  selectedTitleStyle={{marginTop: -1, marginBottom: 6}}
                  selected={selectedTab === 'addGroups'}
                  title={'Add Groups'}
                  renderIcon={() => <Icon containerStyle={{justifyContent: 'center', alignItems: 'center', marginTop: 12}} color={'#5e6977'} name='group-add' size={33} />}
                  renderSelectedIcon={() => <Icon color={'#6296f9'} name='group-add' size={30} />}
                  onPress={() => this.changeTab('addGroups')}>
                  <CreateGroup />
                </Tab>
              }
              </Tabs>
 
  );
}
}


function mapStateToProps(state) {
 const { userdetails } = state.user;

  return { userdetails };

}
export default connect(mapStateToProps, {})(GroupsMain);


//export default GroupsMain;

