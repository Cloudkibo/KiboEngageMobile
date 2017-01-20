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
import * as ChannelActions from '@redux/channel/ChannelActions';
import * as TeamActions from '@redux/team/teamActions';

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
class MessageChannels extends Component {
  static componentName = 'Message Channels';

   constructor(props) {
    super(props);
    this.state = {loading : true};
    this.createDataSource(props);
  }

   componentDidMount = async() => {
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
            this.props.teamFetch(token);
            this.props.channelFetch(token);
            
            
          }
  
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.channels && nextProps.teams){
      this.setState({loading:false});
       this.createDataSource(nextProps);
     }
  }

  createDataSource({ channels 
  }) {
    const ds = new ListView.DataSource({
  
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(channels);
  }

  /**
    * Each List Item
    */

  goToView2(channel,teamName)
  {
        console.log('navigate channel is called');
        Actions.channelEdit({channel:channel,teamName:teamName});
  }
  renderRow = (channel) => (
    <ListItem
      key={`list-row-${channel._id}`}
      onPress={this.goToView2.bind(this,channel,this.props.teams.filter((c) => c._id == channel.groupid)[0].deptname)}
      title={channel.msg_channel_name}
      subtitle={this.props.teams.filter((c) => c._id == channel.groupid)[0].deptname + '\n' + channel.msg_channel_description || null}
     
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
  channelFetch: ChannelActions.channelFetch,
  teamFetch: TeamActions.teamFetch,
 
};
function mapStateToProps(state) {
   const { channels} = state.channels;
   const { teams} = state.teams;
    

  return {channels,teams};

}
export default connect(mapStateToProps, mapDispatchToProps)(MessageChannels);

