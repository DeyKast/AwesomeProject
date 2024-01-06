import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
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
} from "react-native";

import backgroundImage from "../img/background-photo.png";

import useInputFocus from "../js/handleFocus";
import useShowPassword from "../js/handleShowPassword";
import valuesValidator from "../js/validationRegistrationValues";
import handleImagePicker from "../js/handleImagePicker";
import notification from "../js/notification";

const RegistrationScreen = () => {
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
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.photoSelector}
            onPress={() => handleImagePicker(setSelectedImage)}
          >
            {selectedImage && (
              <Image
                source={{ uri: `${selectedImage}` }}
                style={{ width: 120, height: 120, borderRadius: 16 }}
              />
            )}
          </TouchableOpacity>
          <Text style={styles.helloTitle}>Реєстрація</Text>
          <View style={styles.formWrapper}>
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
                onPress={() => toggleShowPassword()}
                style={styles.showPasswordButton}
              >
                <Text style={{ color: "#1B4371", fontSize: 16 }}>
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

export default RegistrationScreen;
