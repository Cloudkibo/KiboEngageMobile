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
import { List, ListItem, SearchBar } from 'react-native-elements';
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
class Groups extends Component {
  static componentName = 'Groups';

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      text: '',
    };
    this.createDataSource(props.groups);
    this.filteredData = this.filteredData.bind(this);
  }

   componentDidMount = async() => {
    console.log('group component did mount called');
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token !== ''){
            this.props.groupFetch(token);
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
    if(nextProps.groups && nextProps.groupagents && nextProps.agents){
      this.setState({loading:false});
       this.createDataSource(nextProps.groups);
     }
  }

  createDataSource(groups) {
    const ds = new ListView.DataSource({

      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(groups);
  }

  filteredData(text) {
    this.setState({
      text,
    });
    const searchText = text.toLowerCase();
    let filtered = [];
    let index = 0;
    console.log(this.props.groups);
    for (let i = 0; i < this.props.groups.length; i++) {
      if (this.props.groups[i].groupname.toLowerCase().search(searchText) > -1) {
        filtered[index] = this.props.groups[i];
        index++;
      }
    }
    console.log(filtered);
    this.createDataSource(filtered);
  }

  /**
    * Each List Item
    */

  goToView2(group)
  {
        console.log('navigate group is called');
        if(group.createdby == this.props.userdetails._id){
          Actions.groupEdit({group:group,groupagents : this.props.groupagents,agents: this.props.agents})
      }

      else{
         Actions.groupJoin({group:group,groupagents : this.props.groupagents})
      }
  }
  renderRow = (group) => (
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
              <List>
                <Spacer size={25} />
                <SearchBar
                  lightTheme
                  round
                  ref={(b) => { this.search = b; }}
                  onChangeText={this.filteredData}
                  value={this.state.text}
                  placeholder="Search"
                />
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
  groupFetch: GroupActions.groupFetch,
  agentGroupFetch : GroupActions.agentGroupFetch,
  agentFetch: AgentActions.agentFetch,

};
function mapStateToProps(state) {
  const { groups, groupagents } = state.groups;
  const { agents } = state.agents;
  const { userdetails } = state.user;
  return { groups, groupagents, agents, userdetails };


}
export default connect(mapStateToProps, mapDispatchToProps)(Groups);
