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
import * as GroupActions from '@redux/group/GroupActions';
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
    var Status = FormValidation.enums({
              public: 'Public',
              private: 'Private'
            });
   
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
      dataSourceAllAgents  : new ListView.DataSource({
            rowHasChanged : (row1, row2) => true
        }),
      dataSourceFellowAgents  : new ListView.DataSource({
            rowHasChanged : (row1, row2) => true
        }),

      
      form_fields: FormValidation.struct({
        groupName:validName,
        groupDescription: validDesc,
        status:Status,
      }),
      empty_form_values: {
        groupName:'',
        groupDescription: '',
      
      },
      form_values: {
        groupName:this.props.group.groupname,
        groupDescription: this.props.group.groupdescription,
        status:this.props.group.status,
      
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
          status:{
            nullOption:false,
          }
          
        },
      },
    };



    

  }

  componentDidMount =  () => {
    // Get user data from AsyncStorage to populate fields
  
      
      this.newFellowAgents  = this.props.groupagents.filter((c) => c.groupid._id == this.props.group._id)
      
      let ds = this.state.dataSourceAllAgents.cloneWithRows(this.props.agents);
      let ds2 = this.state.dataSourceFellowAgents.cloneWithRows(this.newFellowAgents);

      this.setState({

          dataSourceAllAgents  : ds,
          dataSourceFellowAgents  : ds2,

      });

      console.log('dataSourceAllAgents');
      console.log(this.state.dataSourceAllAgents);
  }

  /**
    * Create Team
    */
  renderRow = (agent) => (
    <ListItem
      key={`list-row-${agent._id}`}
      onPress={this.addAgent.bind(this,agent)}
      title={agent.firstname + ' '+ agent.lastname}
  
      
    />  
    )
  editGroup = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
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
    
            var agentid =[];
            console.log('this.newFellowAgents');
            console.log(this.newFellowAgents);
            for(var j=0;j<this.newFellowAgents.length;j++){
               agentid.push({"_id" :this.newFellowAgents[j].agentid._id})
            }
            
            this.props.editgroup({
              name :credentials.groupName,
              desc:credentials.groupDescription,
              status : credentials.status,
              id:this.props.group._id,
              token:token,
              groupagents: agentid
            });
    
        }
      });
    }
  }
  
 

  addAgent = (c) =>{
    console.log('addAgent is called');
    this.newFellowAgents.push({'groupid': this.props.group._id,'agentid':{'_id':c._id}})
    // update the DataSource in the component state

     
   this.setState({
            form_values : {
                groupName:this.form.getValue().groupName,
                groupDescription: this.form.getValue().groupDescription,
                status:this.form.getValue().status,
             
            },
            dataSourceFellowAgents  : this.state.dataSourceFellowAgents.cloneWithRows(this.newFellowAgents)
        });
  }


  removeAgent = (c) =>{
    console.log('removeAgent is called');
    var indexOfItem = this.newFellowAgents.findIndex((item) => item.groupid === c.groupid && item.agentid._id === c.agentid._id);
    this.newFellowAgents.splice(indexOfItem, 1);
    // update the DataSource in the component state
   this.setState({
            form_values : {
                groupName:this.form.getValue().groupName,
                groupDescription: this.form.getValue().groupDescription,
                status: this.form.getValue().status,
             
            },
            dataSourceFellowAgents  : this.state.dataSourceFellowAgents.cloneWithRows(this.newFellowAgents)
        });
  }
  renderFellowAgents = (fellowAgent) =>{
   console.log('fellowAgent');
   console.log(fellowAgent);
   var flag = 0;
   for(var j=0;j<this.props.agents.length;j++){
        if(this.props.agents[j]._id == fellowAgent.agentid._id){
          console.log('fellowAgent matched');
                return  (<ListItem
                          key={`list-row-${this.props.agents[j]._id}`}
                          title={this.props.agents[j].firstname + ' '+ this.props.agents[j].lastname}
                           onPress={this.removeAgent.bind(this,fellowAgent)}
                          /> )
        flag = 1;
        break;
        }

     
       }
       if(flag == 0){
        return null;
       }

    
  }

  confirmDelete = async() => {
    // Form is valid
        this.setState({ resultMsg: { status: 'Deleting group...' } });

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
              {text: 'Yes', onPress: () => this.confirmDelete()},
            ]
          )

    
     
  }
  

  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <ScrollView style={[AppStyles.container]}>
      <Spacer size={55} />
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
            <Text h3> Fellow Agents </Text>
             <ListView dataSource={this.state.dataSourceFellowAgents}
              renderRow={this.renderFellowAgents}
            />
           
          </View>

         <View>
            <Text h3> All Agents </Text>
            <ListView
                 dataSource={this.state.dataSourceAllAgents}
                 renderRow={this.renderRow}
            />
          </View>

         
           <Spacer size={20} />
          <Button
            title={'Save Changes'}
            onPress={this.editGroup}
          />
           <Spacer size={20} />
          
          <Button
            title={'Delete Group'}
            onPress={this.deleteGroup}
          />

          <Spacer size={10} />

         
        </Card>
       </ScrollView>
    );
  }
}


function mapStateToProps(state) {
   const {groups,grouperror,groupsuccess} =  state.groups;
  
  return {groups,grouperror,groupsuccess};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  editgroup: GroupActions.editgroup,
  deletegroup: GroupActions.deletegroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditGroup);
