import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";

import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import backgroundImage from "./src/img/background-photo.png";
import { useFonts } from "expo-font";

export default function App() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const [focusedInput, setFocusedInput] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert(
            "Вибачте, вам потрібно дозволити доступ до галереї для вибору фото."
          );
        }
      }
    })();
  }, []);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        console.log(selectedImage);
      }
    } catch (error) {
      console.error("Помилка вибору фото:", error);
    }
  };

  const [fontsLoaded] = useFonts({
    RobotoRegular: require("./assets/fonts/Roboto-Regular.ttf"),
    RobotoMedium: require("./assets/fonts/Roboto-Medium.ttf"),
    RobotoBold: require("./assets/fonts/Roboto-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isEmailValid = (email) => {
    // Перевірка формату email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password) => {
    // Перевірка пароля на відповідність вимогам
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegistration = () => {
    // Перевірка наявності даних в усіх полях
    if (!login || !email || !password) {
      alert("Будь ласка, заповніть усі поля");
      return;
    }

    // Перевірка дійсності email
    if (!isEmailValid(email)) {
      alert("Введіть дійсну адресу електронної пошти");
      return;
    }

    // Перевірка пароля
    if (!isPasswordValid(password)) {
      alert(
        "Пароль повинен містити принаймні 8 символів, включаючи хоча б одну літеру або цифру"
      );
      return;
    }

    console.log("Login:", login);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  const handleFocus = (inputName) => {
    setFocusedInput(inputName);
  };

  const handleBlur = () => {
    setFocusedInput("");
  };

  const isInputFocused = (inputName) => {
    return focusedInput == inputName;
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
            onPress={handleImagePicker}
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
              onChangeText={(text) => setLogin(text)}
              maxLength={12}
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
              onPress={handleRegistration}
            >
              <Text style={styles.formBtnText}>Зареєструватися</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.logInText}>Вже є акаунт? Увійти</Text>
          <StatusBar style="auto" />
        </View>
      </ImageBackground>
    </View>
  );
}

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
