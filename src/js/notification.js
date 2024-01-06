import Toast from "react-native-toast-message";

const notification = (status, text1, text2) => {
  Toast.show({
    type: status,
    text1: text1,
    text2: text2,
  });
};

export default notification;
