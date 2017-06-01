import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  notifications:[],
 notificationerror : '',
 notificationsuccess :'',
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    
    case ActionTypes.ADD_NOTIFICATIONS:
      return {...state,notifications:action.payload,notificationsuccess : '',notificationerror : ''};

    case ActionTypes.CREATE_NOTIFICATION_SUCCESS:
      return { ...state, notificationsuccess: 'Notification sent to customers successfully' };
    case ActionTypes.CREATE_NOTIFICATION_FAIL:
      return { ...state, notificationerror: 'Notification not added successfully', loading: false };
    case ActionTypes.RESEND_NOTIFICATION_SUCCESS:
      return { ...state, notificationsuccess: 'Notification resent to customers successfully' };
    case ActionTypes.RESEND_NOTIFICATION_FAIL:
      return { ...state, notificationerror: 'Notification sending failed', loading: false };
   
    default:
      return state;
  }
};
