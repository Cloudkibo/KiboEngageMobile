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
import * as TeamActions from '@redux/team/TeamActions';
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
class Teams extends Component {
  static componentName = 'Teams';

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      text: '',
    };
    this.createDataSource(props.teams);
    this.filteredData = this.filteredData.bind(this);
  }

   componentDidMount = async() => {
    console.log('team component did mount called');
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token !== ''){
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
    if(nextProps.teams && nextProps.teamagents && nextProps.agents){
      this.setState({loading:false});
       this.createDataSource(nextProps.teams);
     }
  }

  createDataSource(teams) {
    const ds = new ListView.DataSource({

      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(teams);
  }

  filteredData(text) {
    this.setState({
      text,
    });
    const searchText = text.toLowerCase();
    let filtered = [];
    let index = 0;
    console.log(this.props.teams);
    for (let i = 0; i < this.props.teams.length; i++) {
      if (this.props.teams[i].groupname.toLowerCase().search(searchText) > -1) {
        filtered[index] = this.props.teams[i];
        index++;
      }
    }
    console.log(filtered);
    this.createDataSource(filtered);
  }

  /**
    * Each List Item
    */

  goToView2(team)
  {
        console.log('navigate team is called');
        if(team.createdby == this.props.userdetails._id){
          Actions.teamEdit({team:team,teamagents : this.props.teamagents,agents: this.props.agents})
      }

      else{
         Actions.teamJoin({team:team,teamagents : this.props.teamagents})
      }
  }
  renderRow = (team) => (
    <ListItem
      key={`list-row-${team._id}`}
      onPress={this.goToView2.bind(this,team)}
      title={team.groupname}
      subtitle={team.status +'\n' + team.groupdescription || null}


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
  teamFetch: TeamActions.teamFetch,
  agentTeamFetch : TeamActions.agentTeamFetch,
  agentFetch: AgentActions.agentFetch,

};
function mapStateToProps(state) {
  const { teams, teamagents } = state.teams;
  const { agents } = state.agents;
  const { userdetails } = state.user;
  return { teams, teamagents, agents, userdetails };


}
export default connect(mapStateToProps, mapDispatchToProps)(Teams);
