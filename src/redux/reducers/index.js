import {combineReducers} from 'redux';
import UserReducer from './UserReducer';
import ParentReducer from './ParentReducer';
import ProfReducer from './ProfReducer';

export default combineReducers({
  UserReducer,
  ParentReducer,
  ProfReducer,
});
