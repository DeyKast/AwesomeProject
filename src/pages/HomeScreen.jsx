import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";

import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import fetchPostsData from "../js/fetchPostsData";
import RegistrationScreen from "./RegistrationScreen";
import LoginScreen from "./LoginScreen";

const HomeScreen = () => {
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPostsData();
        setPostsData(data);
      } catch (error) {
        console.error("Помилка при отриманні даних:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <FlatList
          data={postsData}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#E07F7C",
                  textAlign: "center",
                }}
              >
                {item.title}
              </Text>
              <Text style={{ color: "#e6e6e6" }}>{item.body}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
              >
                <Text style={{ color: "#8c8c8c" }}>
                  {item.tags.map((tag, index) => (
                    <React.Fragment key={index}>
                      {tag}
                      {index < item.tags.length - 1 && " |"}{" "}
                    </React.Fragment>
                  ))}
                </Text>
                <Text style={{ color: "#e6e6e6" }}>♥ {item.reactions}</Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
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
    height: "100%",
    width: "100%",

    padding: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#2A2C32",

    alignItems: "center",
    paddingTop: 90,
    paddingBottom: 80,
  },

  postCard: {
    gap: 10,
    padding: 20,
    backgroundColor: "#2E333B",
    borderRadius: 10,
    marginBottom: 20,

    justifyContent: "space-between",

    width: "100%",
    height: "auto",
  },
});

export default HomeScreen;
