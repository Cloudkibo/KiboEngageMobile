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
  Alert,

} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../../services/auth';
import { List, ListItem, SocialIcon } from 'react-native-elements';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppSizes} from '@theme/';
import * as GroupActions from '@redux/group/groupActions';
import * as TeamActions from '@redux/team/TeamActions';
import { connect } from 'react-redux';
var _ = require('lodash');

// Components
import { Alerts, Card, Spacer, Text, Button } from '@components/ui/';

/* Component ==================================================================== */
class EditGroup extends Component {
  static componentName = 'EditGroup';

  constructor(props) {
    super(props);
    console.log('edit group is called');
    console.log(this.props.group);
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

    this.newFellowAgents  = []
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
      form_values: {
        groupName:this.props.group.deptname,
        groupDescription: this.props.group.deptdescription,

      },
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
            stylesheet: stylesheet
          },

        },
      },
    };



  this.renderRow = this.renderRow.bind(this);

  }

  componentWillMount = () => {
    this.props.resetEditStatus();
  }
  componentDidMount = async () => {
    // Get user data from AsyncStorage to populate fields
    const token = await auth.getToken();
    console.log(this.props.deptteams);
    console.log(this.props.group);
    const groupTeams = this.props.deptteams.filter((c) => c.deptid._id == this.props.group._id);
    console.log(groupTeams);
    for (let i=0; i<groupTeams.length; i++) {
      if (groupTeams[i].teamid) {
        console.log('pushed');
        this.state.newteams.push(groupTeams[i].teamid);
      }
    }

    console.log(this.state.newteams);

    if (token !== '') {
      this.props.teamFetch(token);
    }
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    if (nextProps.teams) {
      console.log('new teams');
      console.log(this.state.newteams);
      const ds = this.state.dataSourceAllTeams.cloneWithRows(nextProps.teams);
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
  editGroup = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    if (this.state.newteams.length < 1) {
      Alert.alert(
        'Warning!',
        'Group cannot be edited. Please add atleast one team in the group',
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

            this.props.editgroup({
              name: credentials.groupName,
              desc: credentials.groupDescription,
              id: this.props.group._id,
              teamagents: this.state.newteams,
              token: token,
            })
        }
      });
    }
  }

  deleteGroupConfirm = async () => {
    // Form is valid
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);

            this.props.deletegroup({
              id:this.props.group._id,
              token:token,
            })
        }

  }


  deleteGroup = () => {

    Alert.alert(
            'Delete Group',
            'Are you sure you want to delete this group?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed!')},
              {text: 'Yes', onPress: () => this.deleteGroupConfirm()},
            ]
          )

  }

  appendTeam(team) {
    let flag = 0;
    for (let i = 0; i < this.state.newteams.length; i++) {
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

    for (let i = 0; i < this.state.newteams.length; i++) {
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
      onPress={this.appendTeam.bind(this, team)}
      title={team.groupname}
      leftIcon={{ name: 'add-circle' }}
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
      <ScrollView
        style={[AppStyles.container]}
        ref={(b) => { this.scrollView = b; }}
      >
        <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.statuscode == 200?this.props.status:''}
            error={this.props.statuscode == 422?this.props.status:''}
          />
          <Alerts
            status=''
            success={this.props.groupeditsuccess}
            error={this.props.groupediterror}
          />

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          {this.props.userdetails.isAdmin == "Yes" &&
          <View>
            <Text h3> Fellow Teams </Text>
            <ListView
              dataSource={this.state.dataSourceFellowTeams}
              renderRow={this.renderRowFellowTeams}
            />
          </View>
        }

          <View>
            <Text h3> All Teams </Text>
            <ListView
              dataSource={this.state.dataSourceAllTeams}
              renderRow={this.renderRow}
            />

          </View>

          <Spacer size={20} />
          {
            this.props.userdetails.isAdmin == "Yes" &&
            <View>
              <Button
                title={'Save Changes'}
                onPress={this.editGroup}
              />
              <Spacer size={20} />

              <Button
                title={'Delete Group'}
                onPress={this.deleteGroup}
              />
            </View>
        }

          <Spacer size={10} />


        </Card>
      </ScrollView>
    );
  }
}


function mapStateToProps(state) {
  const { groups, groupediterror, groupeditsuccess, deptteams } =  state.groups;
  const { userdetails } = state.user;
  const { teams } = state.teams;

  return { groups, groupediterror, groupeditsuccess, userdetails, deptteams, teams };
}


// Any actions to map to the component?
const mapDispatchToProps = {
  editgroup: GroupActions.editgroup,
  deletegroup: GroupActions.deletegroup,
  resetEditStatus: GroupActions.resetGroupEdit,
  teamFetch: TeamActions.teamFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditGroup);
