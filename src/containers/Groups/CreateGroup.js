/**
 * Login Screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  View,
  ListView,
  Alert
} from 'react-native';
import { ListItem } from 'react-native-elements';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../../services/auth';

var _ = require('lodash');
// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';
import * as GroupActions from '@redux/group/groupActions';
import * as TeamActions from '@redux/team/TeamActions';
import { connect } from 'react-redux';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';

/* Component ==================================================================== */
class CreateGroup extends Component {
  static componentName = 'CreateGroup';


  constructor(props) {
    super(props);
    // clone the default stylesheet
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);

    // overriding the text color
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;
    const validName= FormValidation.refinement(
      FormValidation.String, (groupname) => {
        if (groupname.length < 1) return false;
        return true;
      },
    );

    const validDesc= FormValidation.refinement(
      FormValidation.String, (groupdesc) => {
        if (groupdesc.length < 1) return false;
        return true;
      },
    );

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      newteams: [],
      dataSourceAllTeams: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true
      }),
      dataSourceFellowTeams: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true
      }),
      form_fields: FormValidation.struct({
        groupName:validName,
        groupDescription: validDesc,
      }),
      empty_form_values: {
        groupName:'',
        groupDescription: '',

      },
      form_values: {},
      options: {
        fields: {
          groupName: {
            error: 'Please enter group name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          groupDescription: {
            error: 'Please enter short group description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            multiline: true,
            stylesheet: stylesheet // overriding the style of the textbox

        },
      },
    }
  }
}

  componentDidMount = async () => {
    const token = await auth.getToken();
    if (token !== '') {
      this.props.teamFetch(token);
    }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    if (nextProps.teams) {
      const ds = this.state.dataSourceAllTeams.cloneWithRows(nextProps.teams);
      const all = nextProps.teams.filter((c)=>c.groupname == 'All' && c.companyid == nextProps.userdetails.uniqueid)[0]
      this.state.newteams.push(all);
      console.log(this.state.newteams);
      const ds2 = this.state.dataSourceFellowTeams.cloneWithRows(this.state.newteams);
      this.setState({
        dataSourceAllTeams: ds,
        dataSourceFellowTeams: ds2,
      });
    }
  }

  /**
    * Create Team
    */
  createGroup = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    if (this.state.newteams.length < 1) {
      Alert.alert(
        'Warning!',
        'Group cannot be created. Please add atleast one team in the group',
        [
          { text: 'Ok', onPress: () => console.log('Ok Pressed!') },
        ],
      );
    } else if (credentials) {
      this.setState({ form_values: credentials }, async () => {
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);

            this.props.creategroup({
              groupname: credentials.groupName,
              description: credentials.groupDescription,
              newteams: this.state.newteams,
              token:token,
            })
        }
      });
    }
  }

  appendTeam(team) {
    let flag = 0;
    for (let i = 0; i<this.state.newteams.length; i++) {
      if (this.state.newteams[i]._id == team._id) {
          flag = 1;
          break;
      }
    }
    if (flag == 0) {
      this.state.newteams.push(team);
      const ds2 = this.state.dataSourceFellowTeams.cloneWithRows(this.state.newteams);
      this.setState({
        form_values: {
          groupName: this.form.getValue().groupName,
          groupDescription: this.form.getValue().groupDescription,
        },
        dataSourceFellowTeams: ds2,
      });
  }
    else {
      Alert.alert(
        'Add Team',
        'Team already added in the group',
        [
          { text: 'Ok', onPress: () => console.log('Ok Pressed!') },
        ],
      );
    }
  }

  removeTeam(team) {
    let index;
    console.log(this.state.newteams);
    console.log(team);

    for (let i=0; i<this.state.newteams.length; i++) {
      if (this.state.newteams[i]._id == team._id) {
        index = i;
        break;
      }
    }
    this.state.newteams.splice(index, 1);
    const ds2 = this.state.dataSourceFellowTeams.cloneWithRows(this.state.newteams);
    this.setState({
      form_values: {
        groupName: this.form.getValue().groupName,
        groupDescription: this.form.getValue().groupDescription,
      },
      dataSourceFellowTeams: ds2,
    });
  }

  renderRow = team => (
    <ListItem
      key={`list-row-${team._id}`}
      title={team.groupname}
      leftIcon={{ name: 'add-circle' }}
      onPress={this.appendTeam.bind(this, team)}
    />
    )

  renderRowFellowTeams = team => (
    <ListItem
      key={`list-row-${team._id}`}
      title={team.groupname}
      leftIcon={{ name: 'remove-circle' }}
      onPress={this.removeTeam.bind(this, team)}
    />
    )

  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <View
        renderBackButton={() => (null)}
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
        <Spacer size={55} />
        <ScrollView
          ref={(b) => { this.scrollView = b; }}
        >
          <Card>
            <Alerts
              status={this.state.resultMsg.status}
              success={this.props.groupsuccess}
              error={this.props.grouperror}
            />

            <Form
              ref={(b) => { this.form = b; }}
              type={this.state.form_fields}
              value={this.state.form_values}
              options={this.state.options}
            />

            <Spacer size={20} />
            <View>
              <Text h3> Fellow Teams </Text>
              <ListView
                dataSource={this.state.dataSourceFellowTeams}
                renderRow={this.renderRowFellowTeams}
              />
            </View>
            <View>
              <Text h3> All Teams </Text>
              <ListView
                dataSource={this.state.dataSourceAllTeams}
                renderRow={this.renderRow}
              />
            </View>

            <Spacer size={20} />

            <Button
              title={'Create Group'}
              onPress={this.createGroup}
            />

          </Card>
        </ScrollView>
      </View>
    );
  }
}


function mapStateToProps(state) {
  const { groups, grouperror, groupsuccess } = state.groups;
  const { teams } = state.teams;
  const { userdetails } = state.user;

  return { groups, grouperror, groupsuccess, teams, userdetails };
}


// Any actions to map to the component?
const mapDispatchToProps = {
  creategroup: GroupActions.creategroup,
  teamFetch: TeamActions.teamFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
