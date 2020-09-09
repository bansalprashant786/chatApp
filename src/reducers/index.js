import userInfo from './users';
import conversation from './conversation';
import contacts from './contacts';

const reducers = {
  userInfo,
  conversation,
  contacts
}


const sortedReducers = Object.keys(reducers).sort().reduce((acc, cur) => {
  acc[cur] = reducers[cur];
  return acc;
}, {});

export default sortedReducers;
