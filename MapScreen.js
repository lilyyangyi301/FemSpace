import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Button, Text } from "react-native";
import Modal from "react-native-modal";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/FontAwesome";

import * as Location from "expo-location"; // Import Expo Location
import axios from "axios";

export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const pinLocations = [
    {
      id: 1,
      title: "Waterloo Public Library",
      latitude: 43.47669,
      longitude: -80.52782,
      description: "35 Albert St, Waterloo, ON N2L 5E2",

      periodProducts: "check-circle",
      periodProductsColor: "green",
      changingTable: "check-circle",
      changingTableColor: "green",
      familyWashroom: "times-circle",
      familyWashroomColor: "red",
      feedingRoom: "times-circle",
      feedingRoomColor: "red",
      genderNeutral: "check-circle",
      genderNeutralColor: "green",
    },
    {
      id: 2,
      title: "Connestoga Mall",
      latitude: 43.4979,
      longitude: -80.5273,
      description: "550 King St N, Waterloo, ON N2L 6L2",

      periodProducts: "exclamation-circle",
      periodProductsColor: "#FFA500",
      changingTable: "check-circle",
      changingTableColor: "green",
      familyWashroom: "check-circle",
      familyWashroomColor: "green",
      feedingRoom: "times-circle",
      feedingRoomColor: "red",
      genderNeutral: "check-circle",
      genderNeutralColor: "green",
    },

    {
      id: 3,
      title: "Square One Shopping Centre",
      latitude: 43.593,
      longitude: -79.6425,
      description: "100 City Centre Dr, Mississauga, ON L5B 2C9",

      periodProducts: "check-circle",
      periodProductsColor: "green",
      changingTable: "check-circle",
      changingTableColor: "green",
      familyWashroom: "check-circle",
      familyWashroomColor: "green",
      feedingRoom: "check-circle",
      feedingRoomColor: "green",
      genderNeutral: "check-circle",
      genderNeutralColor: "green",
    },
  ];

  const [city, setCity] = useState(""); // State to store the entered city
  const [selectedPin, setSelectedPin] = useState(null);

  const handlePinClick = (location) => {
    setSelectedPin(location);
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setRegion({
          ...region,
          latitude,
          longitude,
        });
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    })();
  }, []);

  const handleCityChange = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setRegion({
          ...region,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        });
      } else {
        alert("City not found. Please try another city.");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a Location"
          onChangeText={(text) => setCity(text)}
          value={city}
        />
        <Button title="Enter" color={"#FC46AA"} onPress={handleCityChange} />
      </View>
      <MapView style={styles.map} region={region}>
        {pinLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
            onPress={() => handlePinClick(location)}
          />
        ))}
      </MapView>

      <Modal
        visible={selectedPin !== null}
        //transparent={true}
        animationIn="slideInUp" // Customize animation as needed
        animationOut="slideOutDown" // Customize animation as needed
        onBackdropPress={() => setSelectedPin(null)}
      >
        <View style={styles.modalContainer}>
          <View>
            <Text style={styles.modalTitle}>{selectedPin?.title}</Text>
          </View>

          <View style={styles.modalIcons}>
            <Icon
              name="map-marker"
              size={16}
              color="#FC46AA"
              marginRight={5}
            ></Icon>
            <Text style={styles.modalDescription}>
              {selectedPin?.description}
            </Text>
          </View>

          <View style={styles.modalIcons} marginTop={10}>
            <Icon
              name={selectedPin?.changingTable}
              size={16}
              marginRight={5}
              color={selectedPin?.changingTableColor}
            ></Icon>
            <Text style={styles.modalDescription}>Changing Table</Text>
          </View>

          <View style={styles.modalIcons}>
            <Icon
              name={selectedPin?.familyWashroom}
              size={16}
              marginRight={5}
              color={selectedPin?.familyWashroomColor}
            ></Icon>
            <Text style={styles.modalDescription}>Family washroom</Text>
          </View>

          <View style={styles.modalIcons}>
            <Icon
              name={selectedPin?.feedingRoom}
              size={16}
              marginRight={5}
              color={selectedPin?.feedingRoomColor}
            ></Icon>
            <Text style={styles.modalDescription}>Feeding room</Text>
          </View>

          <View style={styles.modalIcons}>
            <Icon
              name={selectedPin?.periodProducts}
              size={16}
              marginRight={5}
              color={selectedPin?.periodProductsColor}
            ></Icon>
            <Text style={styles.modalDescription}>Free menstrual products</Text>
          </View>

          <View style={styles.modalIcons}>
            <Icon
              name={selectedPin?.genderNeutral}
              size={16}
              marginRight={5}
              color={selectedPin?.genderNeutralColor}
            ></Icon>
            <Text style={styles.modalDescription}>Gender neutral washroom</Text>
          </View>

          <Button
            title="Running low!"
            color={"#FC46AA"}
            fontSize={17}
            marginTop={25}
            onPress={() =>
              alert(
                "Thank you for informing us about the low availability of products. We'll restock shortly!"
              )
            }
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row", // Display the input and button in a row
    alignItems: "center", // Vertically center the input and button
    marginTop: 50,
    margin: 10,
  },
  input: {
    flex: 1, // Take up remaining space in the row
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10, // Add spacing between the input and button
    padding: 10,
  },
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
  },
  modalContainer: {
    position: "absolute",

    bottom: 20, // Adjust the position as needed
    left: 20, // Adjust the position as needed
    width: 300, // Set the width as desired
    height: 250, // Set the height as desired
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5, // Android only, adds shadow
    shadowColor: "black", // iOS only, adds shadow
    shadowOpacity: 0.3, // iOS only, adds shadow
    shadowRadius: 5, // iOS only, adds shadow
    zIndex: 1000, // Ensure the modal appears above other elements
  },
  modalTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  modalDescription: {
    fontSize: 16,
  },
  modalIcons: {
    flexDirection: "row",
    marginTop: 5,
  },
});
