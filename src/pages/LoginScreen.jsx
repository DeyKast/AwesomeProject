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
} from "react-native";

import backgroundImage from "../img/background-photo.png";

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
          text1: "Вітаю !",
          text2: "Вхід успішно виконано",
        });

        // Отримуємо поточну дату та час
        const currentDate = new Date();
        const registrationTime = currentDate.toISOString();
        await AsyncStorage.setItem("registrationTime", registrationTime);
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
        <View style={styles.section}>
          <View style={styles.photoSelector}>
            {userData.selectedImage && (
              <Image
                source={{ uri: `${userData.selectedImage}` }}
                style={{ width: 120, height: 120, borderRadius: 16 }}
              />
            )}
          </View>
          <Text style={styles.helloTitle}>Увійти</Text>
          <View style={styles.formWrapper}>
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
            <View>
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
              <TouchableOpacity
                onPress={toggleShowPassword}
                style={styles.showPasswordButton}
              >
                <Text style={{ color: "#1B4371", fontSize: 16 }}>
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
          <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
            <Text style={styles.logInText}>Немає акаунту? Зареєструватися</Text>
          </TouchableOpacity>
          <StatusBar style="auto" />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    height: 550,
    width: "100%",

    padding: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFF",

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
    backgroundColor: "#F6F6F6",
    borderRadius: 16,

    position: "absolute",

    top: -60,
  },

  helloTitle: {
    color: "#212121",
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
    borderColor: "#E8E8E8",
    borderRadius: 8,

    backgroundColor: "#F6F6F6",
  },

  formInputFocused: {
    width: "100%",
    height: 50,
    padding: 16,
    fontSize: 16,

    borderWidth: 1,
    borderRadius: 8,

    borderColor: "#FF6C00",
    backgroundColor: "#FFF",
  },

  showPasswordButton: {
    position: "absolute",

    right: 16,
    top: 14,
  },

  formBtn: {
    backgroundColor: "#FF6C00",
    width: "100%",
    height: 50,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",

    marginTop: 27,
    padding: "16px 32px",
  },
  formBtnText: {
    fontSize: 15,
    color: "white",
  },
  logInText: {
    color: "#1B4371",

    textAlign: "center",
    fontFamily: "RobotoRegular",
    fontSize: 16,
    fontStyle: "normal",

    marginTop: 16,
  },
});

export default LoginScreen;
