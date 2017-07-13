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
       }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    // console.log('componentWillReceiveProps is called with chat session data');
    // console.log(nextProps.groups);
    if(nextProps.fbcustomers && nextProps.fbchats){
       this.renderCard(nextProps);
       this.setState({loading:false});
     }
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

  renderCard = (nextProps) => {
      var data = nextProps.fbSessions;
      console.log("Facebook Sessions", nextProps.fbSessions);
      this.state.menuItems = [];
      // Build the actual Menu Items
    data.map((item, index) => {
      var name =  item.user_id.first_name + ' ' + item.user_id.last_name;
      console.log("Item facebook", item);
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
  
};
function mapStateToProps(state) {
   const { fbcustomers,fbchats,fbchatSelected, fbSessions} = state.fbpages;
    const { userdetails } = state.user;
  return { fbcustomers,fbchats,fbchatSelected, fbSessions ,userdetails};

}
export default connect(mapStateToProps, mapDispatchToProps)(FbCustomers);
