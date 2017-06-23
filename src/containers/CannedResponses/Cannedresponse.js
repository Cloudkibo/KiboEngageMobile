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
import * as CannedActions from '@redux/cannedresponse/CannedActions';

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
class Cannedresponse extends Component {
  static componentName = 'CannedResponse';

   constructor(props) {
    super(props);

    this.createDataSource(props);
  }

 componentWillMount(){
  //console.log("cannedresponse componentWillMount")
    if(this.props.userdetails.isAgent == "Yes"){
       Actions.refresh({rightTitle: "",onRight:()=> {console.log('do nothing')}});

   
    }
  }
    
   componentDidMount = async() => {
    console.log("cannedresponse componentDidMount")
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
            this.props.cannedFetch(token);
       
            
          }
  
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.cannedresponses){
       this.createDataSource(nextProps);
     }
  }

  createDataSource({ cannedresponses 
  }) {
    const ds = new ListView.DataSource({
  
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(cannedresponses);
  }

  /**
    * Each List Item
    */

  goToView2(cannedresponse)
  {
        Actions.cannedEdit({cannedresponse:cannedresponse})
  }
  renderRow = (cannedresponse) => (
    <ListItem
      key={`list-row-${cannedresponse._id}`}
      title={cannedresponse.shortcode}
      subtitle={cannedresponse.message || null}
      onPress={this.goToView2.bind(this,cannedresponse)}
      
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
  cannedFetch: CannedActions.cannedFetch,
 };
function mapStateToProps(state) {
   const { cannedresponses} = state.cannedresponses;
   const { userdetails } = state.user;
  return {cannedresponses,userdetails};

}
export default connect(mapStateToProps, mapDispatchToProps)(Cannedresponse);

