const {createSlice} = require('@reduxjs/toolkit');

const ProfReducer = createSlice({
  name: 'ProfData',
  initialState: {
    profData: {},
    profSub: {},
  },
  reducers: {
    setProf(state, action) {
      return {...state, profData: action.payload};
    },
    setProfSub(state, action) {
      return {...state, profSub: action.payload};
    },
    removeProf(state, action) {
      return {...state, profData: {}};
    },
  },
});
export const {setProf, setProfSub, removeProf} = ProfReducer.actions;
export default ProfReducer.reducer;

// [
//   {
//     doctor_email: 'ahmed@gmail.com',
//     doctor_id: '1',
//     doctor_name: 'احمد محمد ',
//     doctor_pass: '147852',
//   },
// ];
