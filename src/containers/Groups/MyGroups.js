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
import * as GroupActions from '@redux/group/groupActions';
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
  static componentName = 'Groups';

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

            this.props.myGroupFetch(token);
            this.props.agentGroupFetch(token);
            this.props.agentFetch(token);
            this.props.getDeptTeams(token);

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
        Actions.groupEdit({group:group,groupagents : this.props.groupagents,agents: this.props.agents})
  }
  renderRow = (mygroups) => (
    <ListItem
      key={`list-row-${mygroups._id}`}
      onPress={this.goToView2.bind(this,mygroups)}
      title={mygroups.deptname}
      subtitle={mygroups.deptdescription || null}


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
  myGroupFetch: GroupActions.myGroupFetch,
  agentGroupFetch : GroupActions.agentGroupFetch,
  agentFetch: AgentActions.agentFetch,
  getDeptTeams: GroupActions.getDeptTeams,
};
function mapStateToProps(state) {
  const { mygroups, groupagents, deptteams } = state.groups;
  const { agents } = state.agents;

  return { mygroups, groupagents, agents, deptteams };

}
export default connect(mapStateToProps, mapDispatchToProps)(MyGroups);
