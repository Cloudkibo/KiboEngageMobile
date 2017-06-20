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
import { List, ListItem, SocialIcon, SearchBar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as SubgroupActions from '@redux/subgroup/SubgroupActions';
import * as GroupActions from '@redux/group/groupActions';

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
class SubGroups extends Component {
  static componentName = 'Message Subgroup';

   constructor(props) {
    super(props);
    this.state = {loading : true, text: ''};
    this.filteredData = this.filteredData.bind(this);
    this.createDataSource(props.subgroups);
  }
  componentWillMount(){
    if(this.props.userdetails.isAgent == "Yes"){
       Actions.refresh({rightTitle: "",onRight:()=> {console.log('do nothing')}});

    }

  }

   componentDidMount = async() => {
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){

            this.props.groupFetch(token);
            this.props.channelFetch(token);


          }

  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.subgroups && nextProps.groups){
      this.setState({loading:false});
       this.createDataSource(nextProps.subgroups);
     }
  }

  createDataSource(subgroups) {
    const ds = new ListView.DataSource({

      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(subgroups);
  }

  /**
    * Each List Item
    */

  goToView2(subgroup,groupName)
  {
        console.log('navigate subgroup is called');
        Actions.channelEdit({subgroup:subgroup,groupName:groupName});
  }
  renderRow = (subgroup) => (
    <ListItem
      key={`list-row-${subgroup._id}`}
      onPress={this.goToView2.bind(this,subgroup,this.props.groups.filter((c) => c._id == subgroup.groupid)[0].deptname)}
      title={subgroup.msg_channel_name}
      subtitle={this.props.groups.filter((c) => c && c._id == subgroup.groupid)[0].deptname + '\n' + subgroup.msg_channel_description || null}

    />


  )

    filteredData(text) {
    this.setState({
      text,
    });
    const searchText = text.toLowerCase();
    let filtered = [];
    let index = 0;
    for (let i = 0; i < this.props.subgroups.length; i++) {
      if (this.props.subgroups[i].msg_channel_name.toLowerCase().search(searchText) > -1) {
        filtered[index] = this.props.subgroups[i];
        index++;
      }
      console.log("Subgroup", this.props.subgroups[i])
    }
    console.log(filtered);
    this.createDataSource(filtered);
  }

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
             <SearchBar
              lightTheme
              round
              ref={(b) => { this.search = b; }}
              onChangeText={this.filteredData}
              value={this.state.text}
              placeholder="Search by Subgroup Name"
            />
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
  channelFetch: SubgroupActions.channelFetch,
  groupFetch: GroupActions.groupFetch,

};
function mapStateToProps(state) {
   const { subgroups} = state.subgroups;
   const { groups} = state.groups;
  const { userdetails } = state.user;

  return {subgroups,groups,userdetails};

}
export default connect(mapStateToProps, mapDispatchToProps)(SubGroups);
