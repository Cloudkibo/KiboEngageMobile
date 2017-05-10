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
import * as AgentActions from '@redux/agents/agentActions';
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
class Agents extends Component {
  static componentName = 'Agents';

 constructor(props) {
    super(props);
    this.createDataSource(this.props);
}
  componentWillMount = async () => {
    //this.props.agentFetch();
     if(this.props.userdetails.isAgent == "Yes"){
       Actions.refresh({rightTitle: "",onRight:()=> {console.log('do nothing')}});
   
    }
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
        this.props.agentFetch(token);
       }
  }



  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.agents){
       this.createDataSource(nextProps);
     }
  }

  createDataSource({ agents }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(agents);
  }

  /**
    * Each List Item
    */
  renderRow = (agent) => (
    <ListItem
      key={`list-row-${agent._id}`}
      title={agent.firstname + ' ' + agent.lastname}
    />

 
  )

  render = () => (
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
 
  )
}

const mapDispatchToProps = {
  agentFetch: AgentActions.agentFetch,
};
function mapStateToProps(state) {
   const { agents } = state.agents;
   const {userdetails} = state.user;
  return { agents,userdetails };

}
export default connect(mapStateToProps, mapDispatchToProps)(Agents);

