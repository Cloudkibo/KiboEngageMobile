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
import * as reportActions from '@redux/reports/reportActions';
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

  render() {
          var Highcharts='Highcharts';
    var conf={
            chart: {
                type: 'bar',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: 'Subgroup wise session stat'
            },
            xAxis: {
                 title: {
                text: 'Number of calls'
            },
            categories: ['General']
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: [30],
            }]
        };

        var conf2={
            chart: {
                type: 'bar',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: 'Platform wise session stat'
            },
            xAxis: {
                 title: {
                text: 'Number of calls'
            },
            categories: ['Web', 'Mobile']
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: [30, 50],
            }]
        };


        var conf3={
            chart: {
                type: 'bar',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: 'Group wise session stat'
            },
            xAxis: {
                 title: {
                text: 'Number of calls'
            },
            categories: ['Web', 'Mobile']
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: [30, 50],
            }]
        };

        var conf4={
            chart: {
                type: 'bar',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: 'Page wise session stat'
            },
            xAxis: {
                 title: {
                text: 'Number of calls'
            },
            categories: ['Web', 'Mobile']
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: [30, 50],
            }]
        };

        var conf5={
            chart: {
                type: 'bar',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: 'Mobile Clients vs Web Clients'
            },
            xAxis: {
                 title: {
                text: 'Number of calls'
            },
            categories: ['Web', 'Mobile']
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: [30, 50],
            }]
        };

        var conf6={
            chart: {
                type: 'bar',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: 'Average Session Time'
            },
            xAxis: {
                 title: {
                text: 'Number of calls'
            },
            categories: ['Web', 'Mobile']
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: [30, 50],
            }]
        };
        var conf7={
            chart: {
                type: 'bar',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
            },
            title: {
                text: 'Agent wise notification stat'
            },
            xAxis: {
                 title: {
                text: 'Number of calls'
            },
            categories: ['Web', 'Mobile']
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Random data',
                data: [30, 50],
            }]
        };
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
      <ChartView style={{height:300}} config={conf}></ChartView>
      <ChartView style={{height:300}} config={conf2}></ChartView>
      <ChartView style={{height:300}} config={conf3}></ChartView>
      <ChartView style={{height:300}} config={conf4}></ChartView>
      <ChartView style={{height:300}} config={conf5}></ChartView>
      <ChartView style={{height:300}} config={conf6}></ChartView>
      <ChartView style={{height:300}} config={conf7}></ChartView>
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
   const   {invite}    = state.agents;
  return  {invite};
}
export default connect(mapStateToProps, mapDispatchToProps)(Reports);

