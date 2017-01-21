/**
 * Style Guide
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component } from 'react';
import { View, ListView, ScrollView, StyleSheet } from 'react-native';
import { TabBarTop } from 'react-native-tab-view';
import { List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as CustomerActions from '@redux/Customers/CustomerActions';
import Loading from '@components/general/Loading';
import auth from '../../services/auth';

// Consts and Libs
import { AppColors, AppStyles } from '@theme/';

// Components
import { Spacer, Text } from '@components/ui/';

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
class Customers extends Component {
  static componentName = 'Customers';

  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.createDataSource(props);
  }

  componentDidMount = async () => {
    const token = await auth.getToken();
    console.log(`token is Launchview is: ${token}`);
    if (token !== '') {
      this.props.getCustomers(token);
    }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if (nextProps.customers) {
      this.setState({ loading: false });
      this.createDataSource(nextProps);
    }
  }

  createDataSource({ customers }) {
    const ds = new ListView.DataSource({

      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.dataSource = ds.cloneWithRows(customers);
  }

  /**
    * Each List Item
    */

  goToView2(customer)
  {
    console.log('navigate channel is called');
    Actions.customerDetailView({ customer });
  }

  renderRow = (customer) => (
    <ListItem
      key={`list-row-${customer._id}`}
      onPress={this.goToView2.bind(this, customer)}
      title={customer.name?customer.name:customer.customerID}
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
  getCustomers: CustomerActions.getCustomers,
};

function mapStateToProps(state) {
  const { customers } = state.customers;

  return { customers };
}

export default connect(mapStateToProps, mapDispatchToProps)(Customers);
