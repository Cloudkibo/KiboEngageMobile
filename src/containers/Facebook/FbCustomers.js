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
import { List, ListItem, SocialIcon, Card, Button, Icon} from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import * as FbActions from '@redux/facebook/FbActions';

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

avatar:{
  backgroundColor:'red',
  width:34,
  height:34,
  borderRadius:17,
  marginLeft:20
}
});
var querystring = require('querystring');
/* Component ==================================================================== */
class FbCustomers extends Component {
  static componentName = 'Facebook Customers';

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
       // this.props.fetchfbcustomers(token);
        this.props.getfbChats(token);
        this.props.fetchSession(token);
        this.props.getunreadsessionscount(token, this.props.userdetails._id);
       }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    // console.log('componentWillReceiveProps is called with chat session data');
    // console.log(nextProps.groups);
    if(nextProps.fbSessions && nextProps.unreadcountData && nextProps.fbchats){
       this.appendlastmessage(nextProps.fbSessions, nextProps.fbchats, nextProps.unreadcountData);
       this.setState({loading:false});
     }
  }

  orderByDate = (arr, dateProp, order = 0) => {
    return arr.slice().sort(function (a, b) {
      if (order == 0) {
        return b['lastmessage'][dateProp] - a['lastmessage'][dateProp];
      } else {
        return a['lastmessage'][dateProp] - b['lastmessage'][dateProp];
      }
    });
  }

  appendlastmessage = (fbsessions, fbchats, unreadcountData) => {
    let newFBSessions = [];
    for (let i = 0; i < fbsessions.length; i++) {
      const selectedchat = fbchats.filter((c) => c.senderid == fbsessions[i].user_id.user_id || c.recipientid == fbsessions[i].user_id.user_id);
      const lastmessage = selectedchat[selectedchat.length - 1];
      const newfbsession = fbsessions[i];
      newfbsession.lastmessage = lastmessage;
      newFBSessions.push(newfbsession);
    }
    console.log(newFBSessions);
    const sorted = this.orderByDate(newFBSessions, 'timestamp');
    this.renderCard(sorted, unreadcountData);
  }

  gotoChatBox = (item) => {
    this.props.setSession(item);
    console.log('gotoChatBox called');
    console.log(item.user_id.user_id);
    console.log("fbchats", this.props.fbchats);
   this.props.updatedSelectedFbChats(this.props.fbchats.filter((c)=>c.senderid == item.user_id.user_id || c.recipientid == item.user_id.user_id).reverse(),item);
   //Actions.fbChats({fbchatSelected:this.props.fbchats.filter((c)=>c.senderid == item.user_id || c.recipientid == item.user_id)})

   Actions.fbChats();
  }

  renderCard = (fbSessions, unreadcountData) => {
      var data = fbSessions.filter((c) => c.status !== 'resolved');
      console.log("Facebook Sessions", data);
      this.state.menuItems = [];
      // Build the actual Menu Items
    data.map((item, index) => {
      var name =  item.user_id.first_name + ' ' + item.user_id.last_name;
      console.log(item.pageid.pageid + '$' + item.user_id.user_id);
      let unreadCountArray = unreadcountData.filter((c) => c._id.request_id == item.pageid.pageid + '$' + item.user_id.user_id);
      console.log(unreadCountArray);
      let unreadCount;
      if (unreadCountArray.length > 0) {
        unreadCount = unreadCountArray[0].count;
      } else {
        unreadCount = 0;
      }
      console.log(unreadCount);
      if (unreadCount == 0) {
        return this.state.menuItems.push(
          <ListItem
            roundAvatar
            avatar={{uri: item.user_id.profile_pic}}
            key={index}
            title={name}
            onPress={this.gotoChatBox.bind(this,item)}
            subtitle={item.pageid.pageTitle + ", " + item.status}
          />
        );
      } else {
        return this.state.menuItems.push(
          <ListItem
            roundAvatar
            avatar={{uri: item.user_id.profile_pic}}
            key={index}
            title={name}
            onPress={this.gotoChatBox.bind(this,item)}
            subtitle={item.pageid.pageTitle + ", " + item.status}
            badge={{ value: unreadCount, containerStyle: { backgroundColor: 'red' } }}
          />
        );
      }
    }, this);
  }

  render = () => {
    if (this.state.loading) return <Loading />;
    return(
          <View style={[AppStyles.container]}>
          <Spacer size={25} />
         <ScrollView>
           <List containerStyle={{marginTop: 50}}>
           {this.state.menuItems}
           </List>
          </ScrollView>
            </View>

  );
}
}

const mapDispatchToProps = {
  fetchfbcustomers: FbActions.fetchfbcustomers,
  getfbChats:FbActions.getfbChats,
  updatedSelectedFbChats:FbActions.updatedSelectedFbChats,
  fetchSession:FbActions.fetchChatSessions,
  setSession: FbActions.setCurrentSession,
  getunreadsessionscount: FbActions.getunreadsessionscount,
};
function mapStateToProps(state) {
  const { fbcustomers, fbchats, fbchatSelected, fbSessions, unreadcountData } = state.fbpages;
  const { userdetails } = state.user;
  return { fbcustomers, fbchats, fbchatSelected, fbSessions, userdetails, unreadcountData };

}
export default connect(mapStateToProps, mapDispatchToProps)(FbCustomers);
