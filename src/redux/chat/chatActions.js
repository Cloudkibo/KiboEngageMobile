import axios from 'axios';
import * as ActionTypes from '../types';
import * as Config from '../config';
var baseURL = Config.baseURLKiboSupport;
var baseURLKiboEngage = Config.baseURLKiboEngage;
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
    axios.post(`${baseURLKiboEngage}/api/assignToAgent`, data,config)
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
    axios.post(`${baseURL}/api/userchats/create`, input,config)
      .then((res) => {
        // dispatch(assign_agent_status('Successfully Assigned'));
        console.log("Chat Message Sent Successfully");

              axios.post(`${baseURLKiboEngage}/api/getchatfromagent`, input,config)
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


export const resolveChatSession =  (token, sessionid) => {

   var config = {
           headers:{
          'Content-Type': 'application/json',
          'Authorization': token,
      },
    };
      

    data = {
        request_id : sessionid,
     };
  return (dispatch) => {

    axios.post(`${baseURLKiboEngage}/api/resolvechatsession`, data, config)
    .then(res => {
      console.log(res);
      console.log("Chat marked as resolved");
      // dispatch(showSessions(res))
        dispatch(assign_agent_status('Chat Marked As Resolved'));
      }).catch(function (error) {
        console.log('Unable to mark chat as resolved');
        // dispatch(assign_agent_status('Error Occurred'));
        console.log(error);
        // dispatch(confirmInvite(error));
        dispatch(assign_agent_status('Unable to mark chat as resolved'));
      });   
  };
};

export const uploadChatDocfile =(filedata,chatmsg)=>{
     return (dispatch) => {
               console.log("Sending file.....");
                RNFetchBlob.fetch('POST', `https://kiboengage.kibosupport.com/api/uploadchatfile`, {
                               
                                'Content-Type' : 'multipart/form-data',
                                'file': filedata,
                                'chatmsg': chatmsg,
                              },
                              )// listen to upload progress event
                                .uploadProgress((written, total) => {
                                    console.log('uploaded', written / total)
                                    if(written / total == 1){
                                      console.warn('uploaded');  
                                    }
                                    
                                })
                               
                                .then((resp) => {
                                  
                                  if(resp.statusCode == 200){
                                      console.log('File uploaded')
                                  }

                                })
                                .catch((err) => {
                                  console.warn(err);
                                })
             }


  }