const {createSlice} = require('@reduxjs/toolkit');

const ParentReducer = createSlice({
  name: 'ParentData',
  initialState: {
    parentData: [],
    parent_student: {},
  },
  reducers: {
    setParentData(state, action) {
      return {...state, parentData: action.payload};
    },
    setParentStudentData(state, action) {
      return {...state, parent_student: action.payload};
    },
    removeParent(state, action) {
      return {...state, parentData: [], parent_student: {}};
    },
  },
});
export const {setParentData, setParentStudentData, removeParent} =
  ParentReducer.actions;
export default ParentReducer.reducer;
