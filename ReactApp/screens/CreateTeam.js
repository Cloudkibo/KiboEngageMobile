import React, { Component } from 'react';
import { ScrollView ,View,Text} from 'react-native';
import { connect } from 'react-redux';
import { registerUpdate } from '../actions';
import { Card, CardSection, Input, Spinner,Button } from './common';
//import {Button,Icon,View,Text} from '@shoutem/ui'
//import SplashScreen from 'react-native-smart-splash-screen'

class CreateTeam extends Component {
  
  static componentName = 'Create Team';

  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
    close: React.PropTypes.func.isRequired,
  }
  onButtonPress() {
      
  }

  renderButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
           <Button styleName="full-width muted" onPress={this.onButtonPress.bind(this)}>
              Submit
            </Button>
         
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <CardSection>
          <Input
            label="Name"
            placeholder="Enter team name"
            value={this.props.teamname}
            onChangeText={value => this.props.registerUpdate({ prop: 'teamname', value })}          
          />
        </CardSection>

        <CardSection>
           <Input
            label="Description"
            placeholder="Enter short description"
            value={this.props.description}
            multiline = {true}
            onChangeText={value => this.props.registerUpdate({ prop: 'description', value })} 
          />
        </CardSection>

       
        {
          this.props.errorTeamCreate && this.props.errorTeamCreate.map(function (err, i) {
                    return(
                       <Text style={styles.errorTextStyle}>
                          {err}
                       </Text>
       
                    )
                  })
        }
       

        <CardSection>
          {this.renderButton()}
        </CardSection>
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },

  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  }

};

function mapStateToProps(state) {
   const {teamname,description } = state.team;

  return {teamname,description };

}

export default connect(mapStateToProps, {registerUpdate})(CreateTeam);

