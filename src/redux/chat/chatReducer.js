import * as ActionTypes from '../types';

const INITIAL_STATE = {

  data: '',
  loading: true,
  chat: [],
  singleChat: {},
  invite_agent_status: '',
  upload: [],
  currentChats: [],
  unreadcountData: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

   case ActionTypes.FETCH_SESSIONS:
      return {...state,data:action.payload, loading:false};

   case ActionTypes.FETCH_CHATS:
      return {...state,chat:action.payload, loading:false};
    case ActionTypes.ADD_UNREAD_COUNT:
      return { ...state, unreadcountData: action.payload };

    case ActionTypes.SINGLE_CHAT_FETCH:
      return { ...state, chat: [...state.chat, action.payload[0]], loading:false };
    case ActionTypes.SINGLE_SESSION_FETCH:
      return { ...state, data: [...state.data, action.payload[0]], loading:false };
    case ActionTypes.ADD_LASTMESSAGE_CHAT_SESSION:
      return { ...state, data: action.payload };

   case ActionTypes.SINGLE_CHATS:
      return {...state,singleChat:action.payload, loading:false};
  case ActionTypes.ASSIGN_AGENT:
      return {...state,invite_agent_status:action.payload};
  case ActionTypes.UPLOAD_PROGRESS:
      return {...state,upload: [...state.upload, action.payload]};
  case ActionTypes.UPDATE_CHAT:
      return {...state,currentChats: action.payload};
  case ActionTypes.ADD_CHAT:
      return {...state,currentChats: [...state.currentChats, action.payload] };
  case ActionTypes.ASSIGN_AGENT_UPDATE_STATUS:
      console.log('inside ASSIGN_AGENT_UPDATE_STATUS');
      console.log(action.payload)
      return {...state,data:action.payload,loading:false};

    default:
      return {...state,invite_agent_status:''};
  }
};
