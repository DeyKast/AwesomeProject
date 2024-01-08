import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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

import getLocalStorageData from "../js/getLocalStorageData";
import useInputFocus from "../js/handleFocus";
import useShowPassword from "../js/handleShowPassword";

const LoginScreen = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { handleFocus, handleBlur, isInputFocused } = useInputFocus();
  const { showPassword, toggleShowPassword } = useShowPassword();

  useEffect(() => {
    getLocalStorageData()
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Помилка отримання даних:", error);
      });
  }, []);

  const loginValidation = async () => {
    try {
      if (email !== userData.email) {
        Toast.show({
          type: "error",
          text1: "Помилка",
          text2: "Інформації про дану пошту не знайдено",
        });
      } else if (password !== userData.password) {
        Toast.show({
          type: "error",
          text1: "Помилка",
          text2: "Невірно вказаний пароль!",
        });
      } else {
        Toast.show({
          type: "success",
          text1: `Вітаю ${userData.login}!`,
          text2: "Вхід успішно виконано",
        });

        // Отримуємо поточну дату та час
        const currentDate = new Date();
        const registrationTime = currentDate.toISOString();
        await AsyncStorage.setItem("registrationTime", registrationTime);

        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Помилка при вході:", error);
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
            <View style={styles.photoSelector}>
              {userData.selectedImage && (
                <Image
                  source={{ uri: `${userData.selectedImage}` }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: "#EE9377",
                  }}
                />
              )}
            </View>
            <Text style={styles.helloTitle}>Увійти</Text>
            <View style={styles.formWrapper}>
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
                  onPress={toggleShowPassword}
                  style={styles.showPasswordButton}
                >
                  <Text style={{ color: "#E8E8E8", fontSize: 16 }}>
                    {showPassword ? "Сховати" : "Показати"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.formBtn}
                onPress={() => {
                  loginValidation();
                }}
              >
                <Text style={styles.formBtnText}>Увійти</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Registration")}
            >
              <Text style={styles.logInText}>
                Немає акаунту? Зареєструватися
              </Text>
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

export default LoginScreen;
