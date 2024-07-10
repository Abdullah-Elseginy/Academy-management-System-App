const {createSlice} = require('@reduxjs/toolkit');

const UserReducer = createSlice({
  name: 'UserData',
  initialState: {
    userData: {},
    login: false,
    netinfo: true,
    first: false,
    batchData: {},
    subjectData: {},
    userType: '',
  },
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      return {...state, userData: user, login: true, userType: '1'};
    },
    removeUser(state, action) {
      return {...state, userData: {}, login: false};
    },
    modifyNetInfo(state, action) {
      return {...state, netinfo: action.payload};
    },
    modifyIsFirst(state, action) {
      return {...state, first: action.payload};
    },
    modifyBatchData(state, action) {
      return {...state, batchData: action.payload};
    },
    modifySubjectData(state, action) {
      return {...state, subjectData: action.payload};
    },
    modifyUserLogin(state, action) {
      return {...state, login: action.payload};
    },
    modifyUserType(state, action) {
      return {...state, userType: action.payload};
    },
  },
});
export const {
  setUser,
  removeUser,
  modifyNetInfo,
  modifyIsFirst,
  modifyBatchData,
  modifySubjectData,
  modifyUserLogin,
  modifyUserType,
} = UserReducer.actions;
export default UserReducer.reducer;
