import * as ActionTypes from '../types';

const INITIAL_STATE = {
  channels: [],
  loading: false,
  channelerror: '',
  channelsuccess: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.ADD_CHANNELS:
      return { ...state, channels: action.payload, channelerror: '', channelsuccess: '' };

    case ActionTypes.CREATE_CHANNEL:
      return { ...state, loading: true, channelerror: '', channelsuccess: '' };
    case ActionTypes.CREATE_TEAM_SUCCESS:
      return { ...state, ...INITIAL_STATE, channelsuccess: 'Channel created successfully' };
    case ActionTypes.CREATE_TEAM_FAIL:
      return { ...state, channelerror: 'Channel creation failed', loading: false };

    case ActionTypes.EDIT_CHANNEL_SUCCESS:
      return { ...state, channelsuccess: 'Channel details updated successfully', channelerror : '', loading: false };

    case ActionTypes.EDIT_CHANNEL_FAIL:
      return { ...state, channelsuccess: '', channelerror : 'Channel details updation failed', loading: false };

    case ActionTypes.DELETE_CHANNEL_SUCCESS:
      return { ...state, channelsuccess: 'Channel deleted successfully', channelerror : '', loading: false };

    case ActionTypes.DELETE_CHANNEL_FAIL:
      return { ...state, channelsuccess: '', channelerror : 'Channel deletion failed', loading: false };

    default:
      return state;
  }
};
