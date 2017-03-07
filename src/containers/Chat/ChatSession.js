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
import * as TeamActions from '@redux/team/teamActions';
import * as AgentActions from '@redux/agents/agentActions';
import * as ChannelActions from '@redux/channel/ChannelActions';
import * as GroupActions from '@redux/group/GroupActions';

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
        this.props.teamFetch(token);
        this.props.chatsFetch(token);
        this.props.channelFetch(token);
        this.props.agentGroupFetch(token);
       }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    // console.log('componentWillReceiveProps is called with chat session data');
    // console.log(nextProps.teams);
    if(nextProps.data && nextProps.teams && nextProps.chat){
       this.renderCard(nextProps);
       this.setState({loading:false});
     }
  }


  gotoChatBox = (nextProps, request_id, companyid, _id, departmentid, status, team_name, channel_name, item) => {
    var mychats = nextProps.chat.data.filter((c)=> c.request_id == request_id);
    var sessiondata = {};
    sessiondata.request_id = request_id;
    sessiondata.companyid = companyid;
    sessiondata._id = _id;
    sessiondata.departmentid = departmentid;
    sessiondata.status = status;
    sessiondata.channel_name = channel_name;
    sessiondata.team_name = team_name;
    this.props.singleChats(sessiondata);
    Actions.chat({chat: mychats, sessioninfo: item});
  }

  renderCard = (nextProps) => {
      var data = nextProps.data;
      var team = nextProps.teams;
      this.state.menuItems = [];
      // Build the actual Menu Items
    data.map((item, index) => {
      var name =  item.customerID;
      var mychats = nextProps.chat.data.filter((c)=> c.request_id == item.request_id);

       if(mychats.length <=  0){
         return;
       } 

       if(item.customerid.name){
          name =   item.customerid.name;
       }
       var agent = '';


      var teamname = nextProps.teams.filter((t)=> t._id == item.departmentid);
      
      var channelname = '';
      for (i = 0; i < item.messagechannel.length; i++){
        channelname = item.messagechannel[i];
      }
        var group_agents_name = 'Not assigned yet';
        for (i = 0; i < item.agent_ids.length; i++){
        group_agents_name = item.agent_ids[i].id;
      }
      // var agent_name = nextProps.groupagents.filter((g) => g.agent_id == channelname);
      var channelName = nextProps.channels.filter((c) => c._id == channelname);
      return this.state.menuItems.push(
          
        
          <Card title = {name} key={index}>
             <View>
                <Text style={[styles.menuItem_text]}>
                    { teamname[0].deptname }
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
                        {channelName[0].msg_channel_name}
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
                    onPress = {() => this.gotoChatBox(nextProps, item.request_id, item.companyid, item._id, item.departmentid, item.status,teamname[0].deptname, channelName[0].msg_channel_name, item)} />
                </Card>
      );
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
  chatsFetch: chatActions.chatsFetch,
  teamFetch: TeamActions.teamFetch,
  agentTeamFetch : TeamActions.agentTeamFetch,
  singleChats: chatActions.singleChats,
  channelFetch: ChannelActions.channelFetch,
  groupFetch: GroupActions.groupFetch,
  agentGroupFetch : GroupActions.agentGroupFetch,
};
function mapStateToProps(state) {
   const { data, loading, chat } = state.chat;
   const { teams ,teamagents} = state.teams;
    const { channels} = state.channels;
    const { groupagents } = state.groups;
  return { data, loading, teams, teamagents, chat, channels, groupagents };

}
export default connect(mapStateToProps, mapDispatchToProps)(ChatSession);
