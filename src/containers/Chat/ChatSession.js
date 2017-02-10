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
import * as TeamActions from '@redux/team/teamActions';
import * as AgentActions from '@redux/agents/agentActions';
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

/* Component ==================================================================== */
class ChatSession extends Component {
  static componentName = 'Chat Session';

   constructor(props) {
    super(props);
    this.state = {loading : true};
    this.state.menuItems = [];
    // this.createDataSource(props);
  }

//    componentDidMount = async() => {
//     console.log('team component did mount called');
//      var token =  await auth.getToken();
//       console.log('token is Launchview is: ' + token);
//       if(token != ''){
     
//             this.props.teamFetch(token);
//             this.props.agentTeamFetch(token);
//             this.props.agentFetch(token);

            
//           }
  
//   }

//   componentWillReceiveProps(nextProps) {
//     // nextProps are the next set of props that this component
//     // will be rendered with
//     // this.props is still the old set of props
//     console.log('componentWillReceiveProps is called');
//     console.log(nextProps);
//     if(nextProps.teams && nextProps.teamagents && nextProps.agents){
//       this.setState({loading:false});
//        this.createDataSource(nextProps);
//      }
//   }

//   createDataSource({ teams 
//   }) {
//     const ds = new ListView.DataSource({
  
//       rowHasChanged: (r1, r2) => r1 !== r2
//     });

//     this.dataSource = ds.cloneWithRows(teams);
//   }

  /**
    * Each List Item
    */

//   goToView2(team)
//   {
//         console.log('navigate team is called');
//         Actions.teamEdit({team:team,teamagents : this.props.teamagents,agents: this.props.agents})
//   }
//   renderRow = (team) => (
//     <ListItem
//       key={`list-row-${team._id}`}
//       onPress={this.goToView2.bind(this,team)}
//       title={team.deptname}
//       subtitle={team.deptdescription || null}

      
//     />

 
//   )


  /**
    * Header Component
    */
//   renderHeader = props => (
//     <TabBarTop
//       {...props}
//       style={styles.tabbar}
//       indicatorStyle={styles.tabbarIndicator}
//       renderLabel={scene => (
//         <Text style={[styles.tabbar_text]}>{scene.route.title}</Text>
//       )}
//     />
//   )


  renderCard = () => {
      var data = [1,1,2,2,3];
      // Build the actual Menu Items
    data.map((item) => {
      return this.state.menuItems.push(
          <Card title = 'Sojharo Mangi'>
             <View>
                <Text style={[styles.menuItem_text]}>
                    Finance
                </Text>
                 <View style={[styles.menuItem]}>
                    <View style={styles.iconContainer}>
                        <Icon name={ "today" }/>
                    </View>
                    <View>
                        <Text style={[styles.menuItem_text]}>
                        12:13 Sun Oct 30 2016
                        </Text>
                    </View>

                    </View>
                <View style={[styles.menuItem]}>
                    <View style={styles.iconContainer}>
                        <Icon name={ "dashboard" }/>
                    </View>
                    <View>
                        <Text style={[styles.menuItem_text]}>
                        Test
                        </Text>
                    </View>

                    </View>
                 <View style={[styles.menuItem]}>
                    <View style={styles.iconContainer}>
                        <Icon name={ "assignment-turned-in" }/>
                    </View>
                    <View>
                        <Text style={[styles.menuItem_text]}>
                        Assigned
                        </Text>
                    </View>

                    </View>
                <View style={[styles.menuItem]}>
                    <View style={styles.iconContainer}>
                        <Icon name={ "account-circle" }/>
                    </View>
                    <View>
                        <Text style={[styles.menuItem_text]}>
                        Jawaid Ekram
                        </Text>
                    </View>

                    </View>
             </View>
                <Button
                    backgroundColor='#03A9F4'
                    fontFamily='Lato'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    title='View Chats' />
                </Card>,
      );
    });
  }

  render = () => {
    // if (this.state.loading) return <Loading />;
    this.renderCard();
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
  teamFetch: TeamActions.teamFetch,
  agentTeamFetch : TeamActions.agentTeamFetch,
  agentFetch: AgentActions.agentFetch,
};
function mapStateToProps(state) {
   const { teams ,teamagents} = state.teams;
   const { agents } = state.agents;

  return {teams ,teamagents,agents};

}
export default connect(mapStateToProps, mapDispatchToProps)(ChatSession);

