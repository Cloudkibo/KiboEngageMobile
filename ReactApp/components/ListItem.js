import React, { Component } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
//import { Actions } from 'react-native-router-flux';
import { CardSection } from '../screens/common';

class ListItem extends Component {
  
  render() {
    const { deptname } = this.props.team;

    return (
      <TouchableWithoutFeedback>
        <View>
          <CardSection>
            <Text style={styles.titleStyle}>
              {deptname}
            </Text>
          </CardSection>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  titleStyle: {
    fontSize: 18,
    paddingLeft: 15
  }
};

export default ListItem;
