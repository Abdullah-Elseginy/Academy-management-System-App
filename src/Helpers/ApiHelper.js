import axios from './api';
import utils from '../utils';
export const POST = async (path, data) => {
  try {
    let fetch = await axios.post(`${path}`, data);

    if (fetch.status == 200) {
      let res = fetch.data;
      console.log(res);

      if (res.status == 'success') {
        return res.message;
      } else {
        utils.toastAlert('error', res?.message || 'حدث خطأ ما');
        // let modalData = {show: true, message: res.message, res: 'error'};
        // store.dispatch(modifyAlertModal(modalData));
        return null;
      }
    } else {
      utils.toastAlert('error', 'حدث خطأ ما');
      // let modalData = {show: true, message: 'حدث خطأ ما', res: 'error'};
      // store.dispatch(modifyAlertModal(modalData));
      return null;
    }
  } catch (error) {
    utils.toastAlert('error', 'حدث خطأ ما');

    // let modalData = {show: true, message: 'حدث خطأ ما', res: 'error'};
    // store.dispatch(modifyAlertModal(modalData));
  }
};

export const GET = async path => {
  try {
    let fetch = await axios.post(`${path}`);

    if (fetch.status == 200) {
      let res = fetch.data;
      if (res.status == 'success') {
        return res.message;
      } else {
        utils.toastAlert('error', res.message);
        // let modalData = {show: true, message: res.message, res: 'error'};
        // store.dispatch(modifyAlertModal(modalData));
        return null;
      }
    } else {
      utils.toastAlert('error', 'حدث خطأ ما');
      // let modalData = {show: true, message: 'حدث خطأ ما', res: 'error'};
      // store.dispatch(modifyAlertModal(modalData));
      return null;
    }
  } catch (error) {
    utils.toastAlert('error', 'حدث خطأ ما');
    // let modalData = {show: true, message: 'حدث خطأ ما', res: 'error'};
    // store.dispatch(modifyAlertModal(modalData));
  }
};
