/**
 * Style Guide
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { Spacer, Button, Card } from '@components/ui/';
import { AppStyles } from '@theme/';
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

/* Component ==================================================================== */
class CustomerDetailView extends Component {
  static componentName = 'Customer Detail View';

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.customer.name?this.props.customer.name:this.props.customer.customerID,
      email: this.props.customer.email?this.props.customer.email :'-',
      country: this.props.customer.country ? this.props.customer.country:'-',
      phone: this.props.customer.phone?this.props.customer.phone:'-',
    };
  }

  goToView2(name, email) {
    console.log('Send email to customer view is called.');
    Actions.sendEmail({ name, email });
  }

  render = () => {
    return (
      <View style={[AppStyles.container]}>
        <Spacer size={15} />
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={[AppStyles.container]}
        >
          <Spacer size={50} />
          <Card>
            <List>
              <ListItem
                title={`Name:   ${this.state.name}`}
                hideChevron = {true}
              />
              <ListItem
                title={`Email:   ${this.state.email}`}
                 hideChevron = {true}
              />
              <ListItem
                title={`Country:   ${this.state.country}`}
                 hideChevron = {true}
              />
              <ListItem
                title={`Contact No:   ${this.state.phone}`}
                 hideChevron = {true}
              />
            </List>

            <Spacer size={20} />

            <Button
              title={'Send Email'}
              onPress={this.goToView2.bind(this, this.state.name, this.state.email)}
            />
          </Card>
        </ScrollView>
      </View>
    );
  }
}


export default CustomerDetailView;
