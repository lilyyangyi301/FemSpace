import React from "react";
import { View, StyleSheet } from "react-native";
import MapScreen from "./MapScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <MapScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
