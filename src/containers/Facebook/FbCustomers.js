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
        this.props.fetchfbcustomers(token);
        this.props.getfbChats(token);
        
       }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    // console.log('componentWillReceiveProps is called with chat session data');
    // console.log(nextProps.teams);
    if(nextProps.fbcustomers && nextProps.fbchats){
       this.renderCard(nextProps);
       this.setState({loading:false});
     }
  }


  gotoChatBox = (item) => {
   //will call chat messages page
   /*var fbpage = {
      pageid:"101",
      appid:"101",
      pageToken:"101",
      pageTitle:"sample",
      pageDescription:"sample",
      companyid:"cd89f71715f2014725163952",
     
    }
    Actions.EditFbPage({fbpage:fbpage});*/
   this.props.updatedSelectedFbChats(this.props.fbchats.filter((c)=>c.senderid == item.user_id || c.recipientid == item.user_id).reverse());
   //Actions.fbChats({fbchatSelected:this.props.fbchats.filter((c)=>c.senderid == item.user_id || c.recipientid == item.user_id)})
   Actions.fbChats();
  }

  renderCard = (nextProps) => {
      var data = nextProps.fbcustomers;
      this.state.menuItems = [];
      // Build the actual Menu Items
    data.map((item, index) => {
      var name =  item.first_name + ' ' + item.last_name;
      return this.state.menuItems.push(
           <ListItem
                  roundAvatar
                  //avatar={{uri:"https://graph.facebook.com/"+item.user_id+"/picture?width=100&height=100"}}
                  key={index}
                  title={item.first_name + ' ' + item.last_name}
                  onPress={this.gotoChatBox.bind(this,item)}
                  
            />
        
       
      );
    }, this);
  }

  render = () => {
    if (this.state.loading) return <Loading />;
    return(
          <View style={[AppStyles.container]}>
          <Spacer size={25} />
         
           <List containerStyle={{marginTop: 50}}>
           {this.state.menuItems}
           </List>
            </View>
 
  );
}
}

const mapDispatchToProps = {
  fetchfbcustomers: FbActions.fetchfbcustomers,
  getfbChats:FbActions.getfbChats,
  updatedSelectedFbChats:FbActions.updatedSelectedFbChats,
  
};
function mapStateToProps(state) {
   const { fbcustomers,fbchats,fbchatSelected} = state.fbpages;
  
  return { fbcustomers,fbchats,fbchatSelected};

}
export default connect(mapStateToProps, mapDispatchToProps)(FbCustomers);
