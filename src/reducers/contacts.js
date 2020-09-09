import {
	FETCH_CONTACTS
} from '../actions/contact';

const initialState = {
  loading: false,
  loaded: false,
  contacts: []
};

const userInfo = (state = initialState, action = {}) => {
	switch (action.type) {
    case FETCH_CONTACTS: {
      return {
        ...state,
        loaded: true,
        loading: false,
        contacts: action.payload,
        error: false
      };
    }

    default:
      return state;
  }
};

export default userInfo;
