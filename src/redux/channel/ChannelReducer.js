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

    default:
      return state;
  }
};
