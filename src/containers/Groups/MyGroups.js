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
import * as GroupActions from '@redux/group/GroupActions';
import * as AgentActions from '@redux/agents/agentActions';
import Loading from '@components/general/Loading';

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
class MyGroups extends Component {
  static componentName = 'MyGroups';

   constructor(props) {
    super(props);
    this.state = {loading : true};
    this.createDataSource(props);
  }

   componentDidMount = async() => {
    console.log('group component did mount called');
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
            this.props.mygroupFetch(token);
            this.props.agentGroupFetch(token);
            this.props.agentFetch(token);
            
          }
  
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.mygroups && nextProps.groupagents && nextProps.agents){
      this.setState({loading:false});
       this.createDataSource(nextProps);
     }
  }

  createDataSource({ mygroups 
  }) {
    const ds = new ListView.DataSource({
  
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(mygroups);
  }

  /**
    * Each List Item
    */

  goToView2(group)
  {
        console.log('navigate group is called');
        console.log(group);
        if(group.createdby == this.props.userdetails._id){
          Actions.groupEdit({group:group,groupagents : this.props.groupagents,agents: this.props.agents})
      }

      else{
        Actions.groupJoin({group:group,groupagents : this.props.groupagents})
      }
  }
  renderRow = (group) => (
    
      group.groupid?
       <ListItem
      key={`list-row-${group.groupid._id}`}
      onPress={this.goToView2.bind(this,group.groupid)}
      title={group.groupid.groupname}
      subtitle={group.groupid.status +'\n' + group.groupid.groupdescription || null}

      
    /> :
    <ListItem
      key={`list-row-${group._id}`}
      onPress={this.goToView2.bind(this,group)}
      title={group.groupname}
      subtitle={group.status +'\n' + group.groupdescription || null}

      
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

  render = () => {
    if (this.state.loading) return <Loading />;
    
    return(
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
 
  );
}
}

const mapDispatchToProps = {
  mygroupFetch: GroupActions.mygroupFetch,
  agentGroupFetch : GroupActions.agentGroupFetch,
  agentFetch: AgentActions.agentFetch,

};
function mapStateToProps(state) {
   const {mygroups, groups,groupagents } = state.groups;
    const { agents } = state.agents;
   const { userdetails } = state.user;
  return {mygroups,groups ,groupagents,agents,userdetails};
  

}
export default connect(mapStateToProps, mapDispatchToProps)(MyGroups);

