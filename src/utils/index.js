import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {Linking} from 'react-native';
async function get(key, defaultValue = null) {
  try {
    let value = await AsyncStorage.getItem(key);

    if (key != 'first') {
      if (value !== null) {
        value = JSON.parse(value);
      }
    }
    return value;
  } catch (error) {
    console.log("couldn't save data: " + key, error);
  }
}

async function set(key, value) {
  try {
    if (key == 'first') {
      return await AsyncStorage.setItem(key, value);
    } else {
      return await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.log("couldn't save data: " + key, error);
  }
}
async function clear() {
  try {
    return await AsyncStorage.clear(() => {
      console.log('cleared');
    });
  } catch (error) {
    console.log("couldn't save data: " + key, error);
  }
}

function toastAlert(type = 'success', text1, text2) {
  Toast.show({type, text1, text2});
}

const mapMessageData = messages => {
  return messages.map(msg => ({
    ...msg,
    ...(msg.image ? {image: fixImgPath(msg.image)} : {}),
    user: {
      ...msg.user,
      ...(msg.user.avatar ? {avatar: fixImgPath(msg.user.avatar)} : {}),
    },
  }));
};

const getTemptId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const getFileObj = file => {
  return {
    name: file.fileName,
    type: file.type,
    uri: file.uri,
  };
};

function getExt(type) {
  const re = /(?:\/([^/]+))?$/;
  return re.exec(type)[1];
}

function humanFileSize(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB'][i]
  );
}

function openFile(src, type) {
  if (type === 'image/png' || type === 'image/jpeg') return null;
  else
    Linking.canOpenURL(fixImgPath(src)).then(supported => {
      if (supported) Linking.openURL(fixImgPath(src));
    });
}

function isImg(file) {
  return file.type === 'image/png' || file.type === 'image/jpeg';
}

function mapFileData(file) {
  return {
    _id: getTemptId(),
    src: file.uri,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}
export default {
  get,
  set,
  clear,
  toastAlert,
  mapMessageData,
  getTemptId,
  getFileObj,
  getExt,
  humanFileSize,
  openFile,
  isImg,
  mapFileData,
};
