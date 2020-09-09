import {
  login_success,
  login_failed,
  verify_user,
  login_info,
  set_data
} from '../actions/user';

const initialState = {
  loading: false,
  loaded: false,
  data: {}
};

const userInfo = (state = initialState, action = {}) => {
	switch (action.type) {
    case login_success: {
      console.log('comes in reducers');
      return {
        ...state,
        loaded: true,
        loading: false,
        data: {...action.payload},
        error: false
      };
    }

    case set_data: {
      return{
        ...state,
        data: { ...state.data, ...action.payload }
      }
    }
    case login_info:{
      return{
        ...state,
        loginInfo: action.payload
      }
    }
    case login_failed: {
      return {
        ...state,
        loaded: false,
        loading: false,
        error: action.payload
      };
    }
    // case verify_user:{
    //   return{
    //     ...state,
    //     verify: isConfirm
    //   }
    // }

    default:
      return state;
  }
};

export default userInfo;
