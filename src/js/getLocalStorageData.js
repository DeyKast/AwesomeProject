import AsyncStorage from "@react-native-async-storage/async-storage";

const getLocalStorageData = async () => {
  try {
    const userData = {
      login: await AsyncStorage.getItem("login"),
      email: await AsyncStorage.getItem("email"),
      password: await AsyncStorage.getItem("password"),
      selectedImage: await AsyncStorage.getItem("selectedImage"),
      registrationTime: await AsyncStorage.getItem("registrationTime"),
    };

    return userData;
  } catch (error) {
    console.error("Помилка отримання даних з локального сховища:", error);
    throw error;
  }
};

export default getLocalStorageData;
