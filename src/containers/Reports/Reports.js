/**
 * Coming Soon
 *
    <InviteAgent text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { PropTypes, Component } from 'react';
import { View, ScrollView } from 'react-native';
import axios from 'axios';
// Consts and Libs
import { AppStyles } from '@theme/';
import ChartView from 'react-native-highcharts';
// Components
import { Text, Card, Spacer, Alerts, } from '@ui/';
import { TextInput, Button } from 'react-native';
import auth from '../../services/auth';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Platformwise } from './Platformwise';
import { Pagewise } from './Pagewise';
import  Channelwise  from './Channelwise';
import { Teamwise } from './Teamwise';
import { Agentwise } from './Agentwise';
import { Notificationwise } from './Notificationwise';
import * as reportActions from '@redux/reports/reportActions';
import { groupBy } from 'underscore';
var querystring = require('querystring');
/* Component ==================================================================== */
styles = {
  cardDescription: {
    fontStyle: 'normal',
    fontSize: 10
  }
}




class Reports extends Component {

  constructor(props){
    super(props);
    this.state = {
        error: '',
        filterDays: 365,
        countrySeries: {web: 30, mobile:50},
        agentSeries: {web: 30, mobile:50},
        teamSeries: {web: 30, mobile:50},
        pageSeries: {web: 30, mobile:50},
        notificationSeries: {web: 30, mobile:50},
    };
    
  }

  componentDidMount = async() => {
    console.log('reports component did mount called');
     var token =  await auth.getToken();
    if(token != ''){
        this.props.fetchCountryStats(token);
        this.props.fetchAgentStats(token);
        this.props.fetchPageStats(token);
        this.props.fetchTeamStats(token);
        this.props.fetchNotificationStats(token);
    }
  
  }


  fetchData = async () => {
    var token =  await auth.getToken();
    if(token != ''){
        this.props.fetchCountryStats(token);
        this.props.fetchAgentStats(token);
        this.props.fetchPageStats(token);
        this.props.fetchTeamStats(token);
        this.props.fetchNotificationStats(token);
    }
  }

   componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
       // console.log(nextProps.groups);
    // if(nextProps.country && nextProps.page){
      this.handleCountryStats(nextProps.country);
      this.handlePageStats(nextProps.page);
      this.handleTeamStats(nextProps.team);
      this.handleAgentStats(nextProps.agent);
      this.handleNotificationStats(nextProps.notification);
  // }
  }


  handleCountryStats = (data) => {
      var d = new Date();
      d.setDate(d.getDate()-this.state.filterDays);
      d.setHours(0,0,0,0);
      var groupedData = groupBy(data, function(d){return d._id.platform});
      console.log("Country Series Stat", groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
            result[key] = groupedData[key].reduce((total, obj) => {  
                var date = new Date(obj._id.month + '-' + obj._id.day + '-' + obj._id.year);
                date.setHours(0,0,0,0);
                if(date >= d){  
                     return (total + obj.count);
                }else{
                  return total;
                }
            }, 0);
          }
      }
      console.log("Country Result", result);
      // return result;
      this.setState({countrySeries: result});
  }

  handlePageStats = (data) => {
      var d = new Date();
      d.setDate(d.getDate()-this.state.filterDays);
      d.setHours(0,0,0,0);
      var groupedData = groupBy(data, function(d){return d._id.currentpage});
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
            result[key] = groupedData[key].reduce((total, obj) => {
               var date = new Date(obj._id.month + '-' + obj._id.day + '-' + obj._id.year);
                date.setHours(0,0,0,0);
                if(date >= d){  
                    return total + obj.count;
                }else{
                  return total;
                }
        }, 0);
          }
      }
    //   console.log(result);
    //   return result;
    this.setState({pageSeries: result});
    // return result;
  }

  handleTeamStats = (data) => {
      var d = new Date();
      d.setDate(d.getDate()-this.state.filterDays);
      d.setHours(0,0,0,0);
      console.log("Handle teams", data);
      var groupedData = groupBy(data.gotDeptCalls, function(d){return d._id.departmentid});
      console.log("Handle Teams After being grouped", groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
            // result[key] = groupedData[key].reduce((total, obj) => total + obj.count, 0);
            data.deptNames.map((obj) => {
                if(obj._id == key){
                result[obj.deptname] =  groupedData[key].reduce((total, object) => {
               var date = new Date(object._id.month + '-' + object._id.day + '-' + object._id.year);
                date.setHours(0,0,0,0);
                if(date >= d){  
                    return total + object.count;
                }else{
                  return total;
                }
        }, 0);
                }
            });
          }
      }
    //   console.log("Handle team stats", result);
      this.setState({teamSeries: result})
  }

  handleAgentStats = (data) => {
      var d = new Date();
      d.setDate(d.getDate()-this.state.filterDays);
      d.setHours(0,0,0,0);
      var groupedData = groupBy(data, function(d){return d._id.agent_ids.type});
      console.log("Agent series stats", groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
            result[key] = groupedData[key].reduce((total, obj) => {
               var date = new Date(obj._id.month + '-' + obj._id.day + '-' + obj._id.year);
                date.setHours(0,0,0,0);
                if(date >= d){  
                    return total + obj.count;
                }else{
                  return total;
                }
        }, 0);
          }
      }
      console.log("Agent result", result);
      this.setState({agentSeries: result})
  }

  handleNotificationStats = (data) => {
      var d = new Date();
      d.setDate(d.getDate()-this.state.filterDays);
      d.setHours(0,0,0,0);
      var groupedData = groupBy(data.notficationsCount, function(d){return d._id.agent_id});
      console.log("Notification series stats", groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
             data.agentData.map((obj) => {
                if(obj._id == key){
                    result[obj.firstname + ' ' +obj.lastname] =  groupedData[key].reduce((total, object) => {
                   return  total + object.count;
               
        }, 0);
                }
            });
          }
      }
      console.log("Notification result", result);
      this.setState({notificationSeries: result});
  }

  setFilterDays(x){
    this.setState({filterDays: x});
    this.handleCountryStats(this.props.country);
    this.handlePageStats(this.props.page);
    this.handleTeamStats(this.props.team);
    this.handleAgentStats(this.props.agent);
    this.handleNotificationStats(this.props.notification);
  }

  render() {
    // this.setState({countrySeries: result});
    // this.state.countrySeries = this.handleCountryStats(this.props.country);
    // pageSeries = this.handlePageStats(this.props.page);
    // teamSeries = this.handleTeamStats(this.props.team);
    // agentSeries = this.handleAgentStats(this.props.agent);
    // notificationSeries = this.handleNotificationStats(this.props.notification);
    var Highcharts='Highcharts';
    
    return (
      <View style={[AppStyles.container]}>
    <Spacer size={50} />
    <View>
    <Button title="Todays" color={this.state.filterDays==1 ? '#ff5c5c' : '#2e8dfe'} onPress={() => {this.setFilterDays(1);} }></Button>
    <Button title="Last 7 days" color={this.state.filterDays==7 ? '#ff5c5c' : '#2e8dfe'} onPress={() => {this.setFilterDays(7);} }></Button>
    <Button title="Last 30 days" color={this.state.filterDays==30 ? '#ff5c5c' : '#2e8dfe'} onPress={() => {this.setFilterDays(30);} }></Button>
    <Button title="This year" color={this.state.filterDays==365 ? '#ff5c5c' : '#2e8dfe'} onPress={() => {this.setFilterDays(365);} }></Button>
    </View>
    <ScrollView>
    <Channelwise  filterDays={this.state.filterDays}></Channelwise>
      <Platformwise  data={this.state.countrySeries}></Platformwise>
      <Teamwise  data={this.state.teamSeries}></Teamwise>
      <Pagewise  data={this.state.pageSeries}></Pagewise>
      <Agentwise  data={this.state.agentSeries}></Agentwise>
      <Notificationwise  data={this.state.notificationSeries}></Notificationwise>
      </ScrollView>
  </View>
    );
  }
}

Reports.propTypes = { text: PropTypes.string };
Reports.defaultProps = { text: 'Coming soon...' };
Reports.componentName = 'Reports';

/* Export Component ==================================================================== */
const mapDispatchToProps = {
  fetchCountryStats: reportActions.fetchCountryStats,
  fetchTeamStats: reportActions.fetchTeamStats,
  fetchAgentStats: reportActions.fetchAgentStats,
  fetchPageStats: reportActions.fetchPageStats,
  fetchNotificationStats: reportActions.fetchNotificationStats,
};
function mapStateToProps(state) {
   const   { country, page, team, agent, notification }    = state.reports;
  return  { country, page, team, agent, notification };
}
export default connect(mapStateToProps, mapDispatchToProps)(Reports);

