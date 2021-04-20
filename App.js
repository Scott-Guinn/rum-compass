import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Image, TextInput, Animated, Easing } from 'react-native';
import { Constants } from 'expo';
import * as Location from 'expo-location';
const url = 'https://salty-beyond-02367.herokuapp.com/';

import axios from 'axios';

export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [heading, setHeading] = useState(0);
  const [bearing, setBearing] = useState(0);
  const [distance, setDistance] = useState(null);
  const [nameOfDestination, setNameOfDestination] = useState(null);

  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // retrieves heading information from device

  const findCurrentLocationAsync = async () => {
    console.log('findCurrentLocationAsync has been called');
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      setPermissionGranted(true);
    }

    let location = await Location.getCurrentPositionAsync({});
    let bearing = await requestNearest(location.coords.latitude, location.coords.longitude);

    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setHeading(location.coords.heading);
    setLocation(JSON.stringify(location));
  }

  const requestNearest = (lat, long) => {
    console.log('requestNearest has been called:', lat, long);

    const position = { lat: lat, lng: long };
    axios.post(url, { position: position, wantMost: "bar" })
      .then(({ data }) => {
        console.log('data from requestNearest: ', data);
        console.log('Bearing to destination: ', data.bearing);
        console.log('Distance to destination: ', data.distance);
        console.log('Name of destination: ', data.name);
        setBearing(data.bearing);
        setDistance(Math.trunc(data.distance));
        setNameOfDestination(data.name);
      }).catch((err) => {
        console.log('error in GET request to server: ', err);
      })
  }

  // Animation:
  var rotateValue = new Animated.Value(0);
  var b2d = bearing - heading;
  var rotation = rotateValue.interpolate({
    inputRange: [0, .5, .75, 1],
    outputRange: ["0deg", b2d + 30 + 'deg', b2d - 20 + 'deg', b2d + 'deg'] // crude compass wobble simulation
  });

  var transformStyle = {
    transform: [{ rotate: rotation }],
    position: "absolute",
    resizeMode: "contain",
    height: "40%",
    zIndex: 2,
    top: "52%"
  };

  return (
    <SafeAreaView style={styles.container} >
      <TouchableOpacity style={{
        backgroundColor: "darkorange",
        flex: 1,
        justifyContent: "center",
        width: "100%",
        alignItems: 'center'
      }}
        onPress={findCurrentLocationAsync}>
        <Text style={{ fontWeight: 'bold' }}>Where Am I?</Text>
        {permissionGranted ? (
          <View>
            <Text>current latitude: {latitude}</Text>
            <Text>current longitude: {longitude}</Text>
            <Text>current heading: {heading}</Text>
            <Text>bearing to dest: {bearing}</Text>
            <Text>distance: {distance} meters</Text>
            <Text>name of destination: {nameOfDestination}</Text>
          </View>) : (
          <Text> No location </Text>
        )}
      </TouchableOpacity>

      {/* FOR TESTING ONLY:  Sets heading to 45 degrees */}
      <TouchableOpacity onPress={() => setHeading(270)
      }>
        <Text> Set heading to 270 deg</Text>
      </TouchableOpacity >

      <View style={{
        backgroundColor: "green",
        flex: 4,
        justifyContent: "center",
        width: "100%",
        alignItems: 'center'
      }}>
        <Image
          source={require('./assets/new_compass.png')}
          style={styles.compassHousing} />

        <TouchableWithoutFeedback
          onPressIn={() => {
            Animated.timing(rotateValue, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true
            }).start();
          }}
        >
          <Animated.Image
            source={require('./assets/circle_compass.png')}
            style={transformStyle}
          />
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compassHousing: {
    height: "100%",
    width: "100%",
    backgroundColor: "grey",
    resizeMode: "contain",
  },

});
