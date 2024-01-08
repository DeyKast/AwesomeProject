import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import backgroundImage from "../img/background-photo.jpg";

import useInputFocus from "../js/handleFocus";
import useShowPassword from "../js/handleShowPassword";
import valuesValidator from "../js/validationRegistrationValues";
import handleImagePicker from "../js/handleImagePicker";
import notification from "../js/notification";
import getLocalStorageData from "../js/getLocalStorageData";

const RegistrationScreen = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getLocalStorageData();

        if (!userData) {
          return;
        } else {
          const registrationTime = new Date(userData.registrationTime);
          const currentTime = new Date();

          if (
            registrationTime.getTime() + 60 * 60 * 1000 <
            currentTime.getTime()
          ) {
            navigation.navigate("Login");
          } else {
            navigation.navigate("Home");
          }
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, []);

  const navigation = useNavigation();

  const { handleFocus, handleBlur, isInputFocused } = useInputFocus();
  const { showPassword, toggleShowPassword } = useShowPassword();
  const { isEmailValid, isPasswordValid } = valuesValidator();

  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleRegistration = async () => {
    if (!login || !email || !password) {
      notification("error", "Помилка", "Будь ласка, заповніть усі поля");
      return;
    }

    if (!isEmailValid(email)) {
      notification(
        "error",
        "Помилка",
        "Будь ласка, Введіть дійсну адресу електронної пошти"
      );
      return;
    }

    if (!isPasswordValid(password)) {
      notification(
        "error",
        "Помилка",
        "Пароль повинен містити принаймні 8 символів, включаючи хоча б одну літеру або цифру"
      );
      return;
    }

    // Якщо дані пройшли всі перевірки, збережіть їх у локальному сховищі
    try {
      await AsyncStorage.setItem("login", login);
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
      if (selectedImage) {
        await AsyncStorage.setItem("selectedImage", selectedImage);
      }

      notification("success", "Реєстрація успішна !", "Дані збережено");

      navigation.navigate("Login");
    } catch (error) {
      console.error("Помилка збереження даних:", error);
      notification("error", "Помилка !", "Помилка збереження даних");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.photoSelector}
              onPress={() => handleImagePicker(setSelectedImage)}
            >
              {selectedImage && (
                <Image
                  source={{ uri: `${selectedImage}` }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: "#EE9377",
                  }}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.helloTitle}>Реєстрація</Text>

            <View style={styles.formWrapper}>
              <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
              >
                <TextInput
                  placeholder="Логін"
                  style={
                    isInputFocused("login")
                      ? styles.formInputFocused
                      : styles.formInput
                  }
                  value={login}
                  maxLength={12}
                  onChangeText={(text) => setLogin(text)}
                  onFocus={() => handleFocus("login")}
                  onBlur={handleBlur}
                />
              </KeyboardAvoidingView>
              <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
              >
                <TextInput
                  placeholder="Адреса електронної пошти"
                  style={
                    isInputFocused("email")
                      ? styles.formInputFocused
                      : styles.formInput
                  }
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                />
              </KeyboardAvoidingView>
              <View>
                <KeyboardAvoidingView
                  behavior={Platform.OS == "ios" ? "padding" : "height"}
                >
                  <TextInput
                    placeholder="Пароль"
                    style={
                      isInputFocused("password")
                        ? styles.formInputFocused
                        : styles.formInput
                    }
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                  />
                </KeyboardAvoidingView>
                <TouchableOpacity
                  onPress={() => toggleShowPassword()}
                  style={styles.showPasswordButton}
                >
                  <Text style={{ color: "#E8E8E8", fontSize: 16 }}>
                    {showPassword ? "Сховати" : "Показати"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.formBtn}
                onPress={handleRegistration}
              >
                <Text style={styles.formBtnText}>Зареєструватися</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.logInText}>Вже є акаунт? Увійти</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2A2C32",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    height: 550,
    width: "101%",

    padding: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#2A2C32",

    borderColor: "#434a55",
    borderWidth: 2,
    borderBottomWidth: 0,

    alignItems: "center",
    paddingTop: 90,
    paddingBottom: 80,
  },

  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },

  photoSelector: {
    width: 120,
    height: 120,
    backgroundColor: "#434a55",
    borderRadius: 16,

    position: "absolute",

    top: -60,
  },

  helloTitle: {
    color: "#E8E8E8",
    fontSize: 30,
    fontFamily: "RobotoBold",
    fontWeight: "500",
    letterSpacing: 0.3,

    paddingBottom: 33,
  },
  formWrapper: {
    width: "100%",
    gap: 16,
  },
  formInput: {
    width: "100%",
    height: 50,
    padding: 16,
    fontSize: 16,

    borderWidth: 1,
    borderColor: "#1D1E25",
    borderRadius: 8,

    backgroundColor: "#434a55",
    color: "#E8E8E8",
  },

  formInputFocused: {
    width: "100%",
    height: 50,
    padding: 16,
    fontSize: 16,

    borderWidth: 1,
    borderRadius: 8,

    borderColor: "#F28E85",
    backgroundColor: "#2A2C32",
    color: "#E8E8E8",
  },

  showPasswordButton: {
    position: "absolute",

    right: 16,
    top: 14,
  },

  formBtn: {
    backgroundColor: "#EE9377",
    width: "100%",
    height: 50,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",

    marginTop: 27,
    padding: "16px 32px",
  },
  formBtnText: {
    fontSize: 16,
    color: "#FFF",
  },
  logInText: {
    color: "#E8E8E8",

    textAlign: "center",
    fontFamily: "RobotoRegular",
    fontSize: 16,
    fontStyle: "normal",

    marginTop: 16,
  },
});

export default RegistrationScreen;
