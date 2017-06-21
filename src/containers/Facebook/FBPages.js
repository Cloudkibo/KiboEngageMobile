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
import * as FbActions from '@redux/facebook/FbActions';

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
class FBPages extends Component {
  static componentName = 'FB Pages';

  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.createDataSource(props);
  }

 componentWillMount(){
    if(this.props.userdetails.isAgent == "Yes"){
       Actions.refresh({rightTitle: "",onRight:()=> {console.log('do nothing')}});

    }

  }

  componentDidMount = async () => {
    console.log("Component Did Mount in FB PAGES called");
    const token = await auth.getToken();
    console.log(`token is Launchview is ${token}`);
    if (token !== '') {
      this.props.getfbpages(token);
    }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if (nextProps.fbpages) {
      this.setState({ loading: false });
      this.createDataSource(nextProps);
    }
  }

  componentDidUpdate(prevProps){
    this.setState({ loading: false });
    this.createDataSource(this.props);
  }

  createDataSource({ fbpages
  }) {
    const ds = new ListView.DataSource({

      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(fbpages);
  }

  /**
    * Each List Item
    */

  goToView2(fbpage) {
    console.log('navigate subgroup is called');
    Actions.EditFbPage({ fbpage });
  }
  renderRow = (fbpage) => (
    <ListItem
      key={`list-row-${fbpage._id}`}
      onPress={this.goToView2.bind(this, fbpage)}
      title={fbpage.pageTitle}
      subtitle={fbpage.pageDescription}
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

    return (
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
  getfbpages: FbActions.getfbpages,
};

function mapStateToProps(state) {
  const { fbpages } = state.fbpages;
  const {userdetails} = state.user;
  return { fbpages,userdetails };
}
export default connect(mapStateToProps, mapDispatchToProps)(FBPages);
