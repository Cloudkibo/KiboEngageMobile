/**
 * Coming Soon
 *
    <InviteAgent text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { PropTypes, Component } from 'react';
import { View, ScrollView, Picker } from 'react-native';
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
import * as GroupActions from '@redux/group/groupActions';
import * as SubgroupActions from '@redux/subgroup/SubgroupActions';
import * as AgentActions from '@redux/agents/agentActions';
var querystring = require('querystring');
import { groupBy } from 'underscore';
/* Component ==================================================================== */
styles = {
  cardDescription: {
    fontStyle: 'normal',
    fontSize: 10
  }
}
class Channelwise extends Component {

  constructor(props){
    super(props);
    this.state = {
        error: '',
        items: [],
        itemsId: [],
        series: {web: 50, mobile: 50},
    };
  }


componentDidMount = async() => {
    console.log('group component did mount called');
    var token =  await auth.getToken();
    console.log('token is Launchview is: ' + token);
    if(token != ''){
        this.props.groupFetch(token); 
        }
}

componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
       // console.log(nextProps.groups);
    if(nextProps.groups != this.props.groups){
      this.renderPicker(nextProps.groups);
  }if(nextProps.channel != this.props.channel && this.props.subgroups){
      this.handleStats(nextProps);
  }
  if(nextProps.filterDays != this.props.filterDays && this.props.subgroups && (nextProps.channel || this.props.channel)){
      this.handleStats(nextProps);
  }
}

fetchData = async(data) => {
    console.log('Fetching subgroupwise data id: ', data);
    var token =  await auth.getToken();
    console.log('token is Launchview is: ' + token);
    if(token != ''){
        this.props.fetchChannelStats(token, data);
        this.props.channelFetch(token);
    }
    
}

handleStats = (nextProps) => {
      var data = nextProps.channel;
      var d = new Date();
      d.setDate(d.getDate()-nextProps.filterDays);
      d.setHours(0,0,0,0);
      var groupedData = groupBy(data, function(d){return d._id.messagechannel;});
      console.log("In report channel handle data", groupedData);
      var result = {};
      for(var key in groupedData){
          if (groupedData.hasOwnProperty(key)) {
              var subName = key;
              var proceed = false;
              nextProps.subgroups.map((obj) => {
                  if(obj._id == key){
                      subName = obj.msg_channel_name;
                      proceed = true;
                  }
              });
            // if(proceed){
            result[subName] = groupedData[key].reduce((total, obj) => {
               var date = new Date(obj._id.month + '-' + obj._id.day + '-' + obj._id.year);
                date.setHours(0,0,0,0);
                if(date >= d){  
                    return total + obj.count;
                }else{
                  return total;
                }
        }, 0);
    // }
          }
      }
      console.log("My resilt", result);
      console.log("Subgroups in channel graph report", this.props.subgroups);
    //   return result;
    this.setState({series: result});
    // return result;
  }

renderPicker(groups){
    var tempItems = [];

    console.log("Groups in channel graph", this.props.groups);
    groups = groups.filter((obj) => obj.isFbGroup == "No");
    var i = 0;
    var ids = [];
    groups.map((obj) => {
        tempItems.push(<Picker.Item label={obj.deptname}  value={obj._id} />);
        console.log("Added a group");
        ids.push(obj._id);
    });

    tempItems.unshift(<Picker.Item label="Select a channel"  value="test" />)

    // if(ids[0]){ 
    //     this.fetchData(ids[0]);
    //     // this.setState({language: ids[0]});
    // }
    this.setState({items: tempItems});
    
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
                text: 'Channel wise session stat'
            },
            xAxis: {
                 title: {
                text: 'Number of calls'
            },
            categories: Object.keys(this.state.series)
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
                name: 'Channelwise Data',
                data: Object.values(this.state.series),
            }]
        };
          
    console.log("State Lang", this.state.language);
    return (
      <View style={{backgroundColor: "#ffffff"}}>
      <Text>Pick a group: </Text>
      <Picker
        style={{margin: 20, backgroundColor: "#DDDDDD"}}
        selectedValue={this.state.language}
        onValueChange={(lang) => {this.setState({language: lang}); this.fetchData(lang)}}>
        {this.state.items}
        </Picker>
      <ChartView style={{height:300}} config={conf}></ChartView>
      </View>
    );
  }
}


/* Export Component ==================================================================== */
const mapDispatchToProps = {
    channelFetch: SubgroupActions.channelFetch,
     groupFetch: GroupActions.groupFetch,
     fetchChannelStats: reportActions.fetchChannelStats,
};
function mapStateToProps(state) {
   const   { groups }    = state.groups;
   const   { channel }    = state.reports;
   const { subgroups} = state.subgroups;
  return  { groups, channel, subgroups };
}
export default connect(mapStateToProps, mapDispatchToProps)(Channelwise);



