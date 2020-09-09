import {
	fetch_conversation
} from '../actions/conversation';

const initialState = {
  loading: false,
  loaded: false,
  conversations: []
};

const userInfo = (state = initialState, action = {}) => {
	switch (action.type) {
    case fetch_conversation: {
      return {
        ...state,
        loaded: true,
        loading: false,
        conversations: action.payload,
        error: false
      };
    }

    default:
      return state;
  }
};

export default userInfo;
