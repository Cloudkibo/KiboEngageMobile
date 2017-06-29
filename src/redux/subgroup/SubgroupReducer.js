import * as ActionTypes from '../types';

const INITIAL_STATE = {
  subgroups: [],
  loading: false,
  channelerror: '',
  subgroupsuccess: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.ADD_CHANNELS:
      return { ...state, subgroups: action.payload, channelerror: '', subgroupsuccess: '' };

    case ActionTypes.CREATE_CHANNEL:
      return { ...state, loading: true, channelerror: '', subgroupsuccess: '' };
    case ActionTypes.CREATE_CHANNEL_SUCCESS:
      return { ...state, subgroupsuccess: 'Subgroup created successfully' };
    case ActionTypes.CREATE_TEAM_FAIL:
      return { ...state, channelerror: 'Subgroup creation failed', loading: false };

    case ActionTypes.EDIT_CHANNEL_SUCCESS:
      return { ...state, subgroupsuccess: 'Subgroup details updated successfully', channelerror : '', loading: false };

    case ActionTypes.EDIT_CHANNEL_FAIL:
      return { ...state, subgroupsuccess: '', channelerror : 'Subgroup details updation failed', loading: false };

    case ActionTypes.DELETE_CHANNEL_SUCCESS:
      return { ...state, subgroupsuccess: 'Subgroup deleted successfully', channelerror : '', loading: false };

    case ActionTypes.DELETE_CHANNEL_FAIL:
      return { ...state, subgroupsuccess: '', channelerror : 'Subgroup deletion failed', loading: false };
    
    case ActionTypes.RESET_STATUS:
      return { ...state, subgroupsuccess: '', channelerror : '', loading: false };

    default:
      return {...state,channelerror:'',subgroupsuccess:''};
  }
};
