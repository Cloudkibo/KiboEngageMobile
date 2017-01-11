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
import { List, ListItem, SocialIcon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as TeamActions from '@redux/team/teamActions';
import * as AgentActions from '@redux/agents/agentActions';

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
class Teams extends Component {
  static componentName = 'Teams';

   constructor(props) {
    super(props);

    this.createDataSource(props);
  }

   componentDidMount = async() => {
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
            this.props.teamFetch(token);
            this.props.agentTeamFetch(token);
            this.props.agentFetch(token);

            
          }
  
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.teams){
       this.createDataSource(nextProps);
     }
  }

  createDataSource({ teams 
  }) {
    const ds = new ListView.DataSource({
  
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(teams);
  }

  /**
    * Each List Item
    */

  goToView2(team)
  {
        console.log('navigate team is called');
        Actions.teamEdit({team:team,teamagents : this.props.teamagents,agents: this.props.agents})
  }
  renderRow = (team) => (
    <ListItem
      key={`list-row-${team._id}`}
      onPress={this.goToView2.bind(this,team)}
      title={team.deptname}
      subtitle={team.deptdescription || null}

      
    />

 
  )


  /**
    * Header Component
    */
  renderHeader = props => (
    <TabBarTop
      {...props}
      style={styles.tabbar}
      indicatorStyle={styles.tabbarIndicator}
      renderLabel={scene => (
        <Text style={[styles.tabbar_text]}>{scene.route.title}</Text>
      )}
    />
  )

  render = () => (
          <View style={[AppStyles.container]}>
          <Spacer size={15} />
            <ScrollView
              automaticallyAdjustContentInsets={false}
              style={[AppStyles.container]}
            >
             <Spacer size={50} />
              <List>
                <ListView
                 dataSource={this.dataSource}
                 renderRow={this.renderRow}
                />
              </List>
              
            </ScrollView>
            </View>
 
  )
}

const mapDispatchToProps = {
  teamFetch: TeamActions.teamFetch,
  agentTeamFetch : TeamActions.agentTeamFetch,
  agentFetch: AgentActions.agentFetch,
};
function mapStateToProps(state) {
   const { teams ,teamagents} = state.teams;
   const { agents } = state.agents;

  return {teams ,teamagents,agents};

}
export default connect(mapStateToProps, mapDispatchToProps)(Teams);

