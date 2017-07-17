import * as ActionTypes from '../types';

const INITIAL_STATE = {
 fbpages:[],
 fbpagesuccess:'',
 fbpageerror:'',
 fbcustomers:[],
 msgstatus:'',
 fbchatSelected:[],
 fbchats:[],
 emojiVisible: false,
 gifVisible: false,
 stickerVisible: false,
 gifs: [],
 stickers: [],
 upload: [],
 fbSessions: [],
 currentSession: {},
 agent_assign_status: '',
 fbteams: [],
 unreadcountData: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.RESET_FB_CHATS:
      return { ...state,fbpageerror: '', fbpagesuccess: '' };

    case ActionTypes.FBPAGE_SUCCESS:
      return { ...state,fbpageerror: '', fbpagesuccess: action.payload, fbpages: state.fbpages };
    case ActionTypes.FBPAGE_FAIL:
      return { ...state,fbpageerror: 'There is an error occurred. Please try later', fbpagesuccess:'' ,loading: false };

    case ActionTypes.SHOW_FB_CUSTOMERS:
      return { ...state,fbcustomers:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    case ActionTypes.SHOW_FB_CHATS:
    return { ...state,fbchats:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    case ActionTypes.SHOW_UNREAD_COUNT:
      return { ...state, unreadcountData: action.payload };

    case ActionTypes.SHOW_FB_SELECTEDCHATS:
    return { ...state,fbchatSelected:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false,fbCustomerSelected:action.fbCustomerSelected };

    case ActionTypes.SHOW_FB_CHATS_UPDATED:
    return { ...state,fbchatSelected:action.fbchatSelected,fbchats:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    case ActionTypes.FBCHAT_SENT_TO_AGENT:
     return { ...state,msgstatus:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    case ActionTypes.ADD_FB_PAGES:
      return { ...state, fbpages: action.payload, fbpageerror: '', fbpagesuccess: '', loading: false };
    case ActionTypes.EMOJI_VISIBLE:
      return { ...state, emojiVisible: action.payload,};
    case ActionTypes.GIF_VISIBLE:
      return { ...state, gifVisible: action.payload,};
    case ActionTypes.STICKER_VISIBLE:
      return { ...state, stickerVisible: action.payload,};
    case ActionTypes.GIF_UPDATE:
      return { ...state, gifs: action.payload,};
    case ActionTypes.STICKER_UPDATE:
      return { ...state, stickers: action.payload,};
    case ActionTypes.UPLOAD_PROGRESS_FB:
      return {...state,upload: [...state.upload, action.payload]};
    case ActionTypes.FB_SESSIONS:
      return {...state,fbSessions:action.payload};
    case ActionTypes.CURRENT_SESSION:
      return {...state,currentSession:action.payload};
    case ActionTypes.AGENT_ASSIGN_STATUS:
      return {...state,agent_assign_status:action.payload};
    case ActionTypes.UPDATE_STATE_RESOLVE:
      return {...state,currentSession:{...state.currentSession, status: action.payload}};
    case ActionTypes.FB_SESSIONS_STATUS:
      return {...state,fbSessions:state.fbSessions.map((obj) => {
        if(obj._id == action.payload._id){
          obj.status = action.payload.status;
        }
        return obj;
      })};
    case ActionTypes.UPDATE_FB_CHAT_ASSIGNED_STATUS:
      return {...state,fbSessions:action.payload};

    case ActionTypes.DELETE_FBPAGE_SUCCESS:
      return { ...state, fbpageerror: '', fbpagesuccess: 'Page deleted successfully!', fbpages: state.fbpages };
    case ActionTypes.DELETE_FBPAGE_FAIL:
      return { ...state, fbpageerror: 'There is an error occurred. Please try later', fbpagesuccess: '' };
    case ActionTypes.ADD_FBPAGETEAMS:
      return { ...state, fbteams: action.payload };

    default:
      return state;
  }
};
