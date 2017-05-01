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
        filterDays: 30,
        countrySeries: 0,
        agentSeries: 0,
        teamSeries: 0,
        pageSeries: 0,
        notificationSeries: 0,
    };
    this.fetchData();
  }



  fetchData = async () => {
    var token =  await auth.getToken();
    if(token != ''){
        this.props.fetchChannelStats(token);
        this.props.fetchCountryStats(token);
        this.props.fetchAgentStats(token);
        this.props.fetchPageStats(token);
        this.props.fetchTeamStats(token);
        this.props.fetchNotificationStats(token);
    }
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
                     return (total + obj.count);
            }, 0);
          }
      }
      console.log("Country Result", result);
      return result;
    // this.setState({countrySeries: result})
  }

  handlePageStats = (data) => {
      var groupedData = groupBy(data, function(d){return d._id.currentpage});
    //   console.log(groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
            result[key] = groupedData[key].reduce((total, obj) => total + obj.count, 0);
          }
      }
    //   console.log(result);
    //   return result;
    // this.setState({pageSeries: result});
    return result;
  }

  handleTeamStats = (data) => {
      console.log("Handle teams", data);
      var groupedData = groupBy(data.gotDeptCalls, function(d){return d._id.departmentid});
    //   console.log(groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
            // result[key] = groupedData[key].reduce((total, obj) => total + obj.count, 0);
            data.deptNames.map((obj) => {
                if(obj._id == key){
                    result[obj.deptname] =  groupedData[key].reduce((total, object) => total + object.count, 0);
                }
            });
          }
      }
    //   console.log("Handle team stats", result);
      // this.setState({teamSeries: result})
      return result;
  }

  handleAgentStats = (data) => {
      var groupedData = groupBy(data, function(d){return d._id.agent_ids.type});
      console.log("Agent series stats", groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
            result[key] = groupedData[key].reduce((total, obj) => total + obj.count, 0);
          }
      }
      console.log("Agent result", result);
      //this.setState({agentSeries: result})
      return result;
  }

  handleNotificationStats = (data) => {
      var groupedData = groupBy(data.notficationsCount, function(d){return d._id.agent_id});
      console.log("Notification series stats", groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
             data.agentData.map((obj) => {
                if(obj._id == key){
                    result[obj.firstname + ' ' +obj.lastname] =  groupedData[key].reduce((total, object) => total + object.count, 0);
                }
            });
          }
      }
      console.log("Notification result", result);
      // this.setState({notificationSeries: result});
      return result;
  }

  render() {
    
    countrySeries = this.handleCountryStats(this.props.country);
    pageSeries = this.handleCountryStats(this.props.page);
    teamSeries = this.handleTeamStats(this.props.team);
    agentSeries = this.handleAgentStats(this.props.agent);
    notificationSeries = this.handleNotificationStats(this.props.notification);
    var Highcharts='Highcharts';
    
    return (
      <View style={[AppStyles.container]}>
    <Spacer size={50} />
    <View>
    <Button title="Today" style={{padding:30}}></Button>
    <Button title="Last 7 days" style={{margin:3}}></Button>
    <Button title="Last 30 days" style={{margin:3}}></Button>
    <Button title="This year" style={{margin:3}}></Button>
    </View>
    <ScrollView>
      <Platformwise  data={countrySeries}></Platformwise>
      <Teamwise  data={teamSeries}></Teamwise>
      <Pagewise  data={pageSeries}></Pagewise>
      <Agentwise  data={agentSeries}></Agentwise>
      <Notificationwise  data={notificationSeries}></Notificationwise>
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
  fetchChannelStats: reportActions.fetchChannelStats,
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

