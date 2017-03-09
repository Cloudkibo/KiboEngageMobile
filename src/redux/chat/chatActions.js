import axios from 'axios';
import * as ActionTypes from '../types';
var baseURL = `https://api.kibosupport.com`
var querystring = require('querystring');

export function showChats(data) {
  // console.log('show chat messages data');
  // console.log(data);
  return {
    type: ActionTypes.FETCH_CHATS,
    payload : data,
  };
}

export function showSessions(data) {
  // console.log('show data');
  // console.log(data);
  var final = data.data.filter(function (el) {
    return el.platform == "mobile";
});
  return {
    type: ActionTypes.FETCH_SESSIONS,
    payload : final,
  };
}


export const sessionsFetch =  (token) => {

   var config = {
      headers: {
          'Authorization': `Bearer ${token}`,
      },
    };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/visitorcalls/kiboengagesessions`,config)
    .then(res => dispatch(showSessions(res)));   
  };
};

export const chatsFetch =  (token) => {

   var config = {
      headers: {
          'Authorization': `Bearer ${token}`,
      },
    };
      
  return (dispatch) => {
    axios.get(`${baseURL}/api/userchats/`,config)
    .then(res => dispatch(showChats(res)));   
  };
};

export function singleChats(data) {
  // console.log('show single chat messages data');
  // console.log(data);
  return {
    type: ActionTypes.SINGLE_CHATS,
    payload : data,
  };
}


// Assign Agent
export const assignAgent = (token, input,session) => {
    var config = {
      rejectUnauthorized : false,
      headers: {
            'authorization': token,
            'content-type': 'application/json',
            },

          };
    var configKS = {
      rejectUnauthorized : false,
      headers: {
            'authorization': `Bearer ${token}`,
            'content-type': 'application/json',
            },

          };
      var data =  {
           companyid : input.companyid,
           sessionid : input.requestid,
           agentemail: input.email,
           type: input.type,
           agentAssignment : {
            assignedto : input.agentidTo,
            assignedby : input.agentidBy,
            sessionid  : input.requestid,
            companyid  : input.companyid ,
            datetime   : Date.now(),
            type : input.type,
          },
          
      };
  console.log(data);
    return (dispatch) => {
    axios.post(`http://kiboengage.cloudapp.net/api/assignToAgent`, data,config)
    .then(()=>{
      axios.post(`${baseURL}/api/visitorcalls/pickSession`, session,configKS)
    })
      .then((res) => {
        dispatch(assign_agent_status('Successfully Assigned'));
        console.log("Agent Successfully Assigned");
      })
      .catch(function (error) {
        console.log('Error occured');
        dispatch(assign_agent_status('Error Occurred'));
        console.log(error);
        // dispatch(confirmInvite(error));
      });
  };
};


export function assign_agent_status(data) {
  return {
    type: ActionTypes.ASSIGN_AGENT,
    payload : data,
  };
}

// Send Chat to server
export const sendChat  = (token, input) => {
    console.log("In send chat");
    var config = {
      rejectUnauthorized : false,
      headers: {
          'Content-Type': 'application/json',
          'kibo-app-id' : '5wdqvvi8jyvfhxrxmu73dxun9za8x5u6n59',
          'kibo-app-secret': 'jcmhec567tllydwhhy2z692l79j8bkxmaa98do1bjer16cdu5h79xvx',
          'kibo-client-id': 'cd89f71715f2014725163952',
          'authorization': token,
            },

          };
    return (dispatch) => {
    axios.post(`https://api.kibosupport.com/api/userchats/create`, input,config)
      .then((res) => {
        // dispatch(assign_agent_status('Successfully Assigned'));
        console.log("Chat Message Sent Successfully");

              axios.post(`http://kiboengage.cloudapp.net/api/getchatfromagent`, input,config)
                  .then((res) => {
                    // dispatch(assign_agent_status('Successfully Assigned'));
                    console.log("Chat Message Sent Successfully to get chat from agent");
                  })
                  .catch(function (error) {
                    console.log('Error occured in get chat from agent');
                    // dispatch(assign_agent_status('Error Occurred'));
                    console.log(error);
                    // dispatch(confirmInvite(error));
                  });

      })
      .catch(function (error) {
        console.log('Error occured');
        // dispatch(assign_agent_status('Error Occurred'));
        console.log(error);
        // dispatch(confirmInvite(error));
      });
  };
};