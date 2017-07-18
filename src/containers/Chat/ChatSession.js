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
import { List, ListItem, SocialIcon, Card, Button, Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import * as chatActions from '@redux/chat/chatActions';
import * as GroupActions from '@redux/group/groupActions';
import * as AgentActions from '@redux/agents/agentActions';
import * as SubgroupActions from '@redux/subgroup/SubgroupActions';
import * as TeamActions from '@redux/team/TeamActions';
import * as actions from '@redux/user/actions';
import Loading from '@components/general/Loading';

import auth from '../../services/auth';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import { Alerts, Spacer, Text } from '@components/ui/';

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
  menuItem: {
    paddingBottom: 10,
    flexDirection: "row",

  },
 menuItem_text: {
    fontSize: 14,
    lineHeight: parseInt(18 + (18 * 0.5), 10),
    fontWeight: '500',
    marginTop: 3,
    color: '#333333',
    padding: 2,
  },
  iconContainer: {
      marginTop: 6,
    padding: 2,
  },
});
var querystring = require('querystring');
/* Component ==================================================================== */
class ChatSession extends Component {
  static componentName = 'Chat Session';

   constructor(props) {
    super(props);
    this.state = {loading : true};
    this.state.menuItems = [];

    // this.createDataSource(props);
  }

  componentWillMount = async () => {
    //this.props.agentFetch();
     var token =  await auth.getToken();
      // console.log('token is Launchview is: ' + token);
      if(token != ''){
        this.props.sessionsFetch(token);
        this.props.groupFetch(token);
        this.props.chatsFetch(token);
        this.props.channelFetch(token);
        this.props.agentTeamFetch(token);
        this.props.agentFetch(token);
        this.props.teamFetch(token);
        this.props.getDeptTeams(token);
        this.props.getuser(token);
        // this.props.getAllSessions(token, this.props.userdetails.uniqueid);
       }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    // console.log('componentWillReceiveProps is called with chat session data');
    // console.log(nextProps.groups);
    if(nextProps.data && nextProps.userdetails && nextProps.deptteams && nextProps.teams && nextProps.chat && nextProps.agents && nextProps.groupagents && nextProps.teamagents && nextProps.groups){
       console.log("Next Props Received in chat session");
       this.renderCard(nextProps);
       this.setState({loading:false});
     }
  }

  componentDidUpdate(prevProps) {
    console.log('component did update called before');
    if (prevProps.data.length < this.props.data.length) {
      console.log('component did update called');
      this.renderCard(this.props);
    }
  }

  gotoChatBox = (nextProps, request_id, companyid, _id, departmentid, status, team_name, channel_name, item) => {
    var mychats = this.props.chat.filter((c)=> c.request_id == request_id);
    console.log(this.props.chat);
    console.log(mychats);
    var sessiondata = {};
    sessiondata.request_id = request_id;
    sessiondata.companyid = companyid;
    sessiondata._id = _id;
    sessiondata.departmentid = departmentid;
    sessiondata.status = status;
    sessiondata.channel_name = channel_name;
    sessiondata.team_name = team_name;
    sessiondata.chats = mychats;
    this.props.singleChats(sessiondata);
    this.props.updateChat(mychats);
    Actions.chat({sessioninfo: item});
  }


  renderCard = (nextProps) => {
    const data = nextProps.data.filter((c) => c.status != 'resolved');
    this.state.menuItems = [];
    // Build the actual Menu Items
    data.map((item, index) => {
      let name = item.customerID;
      let agentinteam = false;
      const group = nextProps.groups.filter((t) => t._id === item.departmentid);
      let groupTeams = [];
      if (group.length > 0) {
        groupTeams = nextProps.deptteams.filter((c) => c.deptid._id === group[0]._id);
      }
      const agentTeams = nextProps.teamagents.filter((a) => a.agentid === nextProps.userdetails._id);
      if (groupTeams.length > 0) {
        for (let i =0; i < groupTeams.length; i++) {
          if (agentTeams.filter((a) => a.groupid == groupTeams[i].teamid._id).length > 0) {
            agentinteam = true;
          }
        }
      }

      if (agentinteam) {
        const mychats = nextProps.chat.filter((c)=> c.request_id == item.request_id);
        if (mychats.length <= 0) {
          return;
        }

        if (item.customerid.name) {
          name = item.customerid.name;
        }

        var channelname = '';
        if(item.messagechannel.length>0){
          channelname = item.messagechannel[item.messagechannel.length-1];
        }
        var group_agents_name = 'Not assigned yet';
        if(item.agent_ids.length > 0 && item.status == "assigned"){
          if(item.agent_ids[item.agent_ids.length-1].type == 'agent'){
            var agentassigned = this.props.agents.filter((a)=> a._id == item.agent_ids[item.agent_ids.length-1].id)[0];
            if(agentassigned){
              group_agents_name = agentassigned.firstname + agentassigned.lastname;
            }
          }
        }

        // var agent_name = nextProps.teamagents.filter((g) => g.agent_id == channelname);
        var subgroupName = nextProps.subgroups.filter((c) => c._id == channelname);
        return this.state.menuItems.push(

          <Card title = {name} key={index}>
             <View>
                <Text style={[styles.menuItem_text]}>
                    { group.length>0?group[0].deptname :'-'}
                </Text>
                 <View style={[styles.menuItem]}>
                    <View style={styles.iconContainer}>
                        <Icon name={ "today" }/>
                    </View>
                    <View>
                        <Text style={[styles.menuItem_text]}>
                        {item.requesttime}
                        </Text>
                    </View>

                    </View>
                <View style={[styles.menuItem]}>
                    <View style={styles.iconContainer}>
                        <Icon name={ "dashboard" }/>
                    </View>
                    <View>
                        <Text style={[styles.menuItem_text]}>
                        {subgroupName.length>0?subgroupName[0].msg_channel_name:'-'}
                        </Text>
                    </View>

                    </View>
                 <View style={[styles.menuItem]}>
                    <View style={styles.iconContainer}>
                        <Icon name={ "assignment-turned-in" }/>
                    </View>
                    <View>
                        <Text style={[styles.menuItem_text]}>
                        { item.status }
                        </Text>
                    </View>

                    </View>
                <View style={[styles.menuItem]}>
                    <View style={styles.iconContainer}>
                        <Icon name={ "account-circle" }/>
                    </View>
                    <View>
                        <Text style={[styles.menuItem_text]}>
                        {
                         group_agents_name
                        }
                        </Text>
                    </View>

                    </View>
             </View>
                <Button
                    key = {index + '_button'}
                    backgroundColor='#03A9F4'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    title='View Chats'
                    onPress = {() => this.gotoChatBox(nextProps, item.request_id, item.companyid, item._id, item.departmentid, item.status, group[0].deptname ? group[0].deptname:'-', subgroupName[0].msg_channel_name?subgroupName[0].msg_channel_name:'-', item)} />
                </Card>
            );
      }
    }, this);
  }

  render = () => {
    if (this.state.loading) return <Loading />;
    // this.renderCard();
    console.log("Render Session was called");
    return(
          <View style={[AppStyles.container]}>
          <Spacer size={15} />
            <ScrollView
              automaticallyAdjustContentInsets={false}
              style={[AppStyles.container]}
            >
             <Spacer size={50} />
             <View>{this.state.menuItems}</View>


            </ScrollView>
            </View>

  );
}
}

const mapDispatchToProps = {
  sessionsFetch: chatActions.sessionsFetch,
  getAllSessions: chatActions.getAllSessions,
  chatsFetch: chatActions.chatsFetch,
  groupFetch: GroupActions.groupFetch,
  agentGroupFetch : GroupActions.agentGroupFetch,
  singleChats: chatActions.singleChats,
  channelFetch: SubgroupActions.channelFetch,
  teamFetch: TeamActions.teamFetch,
  agentTeamFetch : TeamActions.agentTeamFetch,
  agentFetch: AgentActions.agentFetch,
  updateChat: chatActions.updateChat,
  getDeptTeams: GroupActions.getDeptTeams,
  getuser: actions.getuser,
};
function mapStateToProps(state) {
  const { data, loading, chat } = state.chat;
  const { groups, groupagents, deptteams } = state.groups;
  const { subgroups } = state.subgroups;
  const { agents } = state.agents;
  const { teamagents, teams } = state.teams;
  const { userdetails } = state.user;
  return { data, loading, groups, groupagents, agents, chat, subgroups, teamagents, teams, deptteams, userdetails };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatSession);
