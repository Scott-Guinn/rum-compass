import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Animated,
  Easing
} from 'react-native';
import { Constants } from 'expo';
import * as Location from 'expo-location';
const serverUrl = 'https://salty-beyond-02367.herokuapp.com/';

import axios from 'axios';

export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [heading, setHeading] = useState(0);
  const [bearing, setBearing] = useState(0);
  const [distance, setDistance] = useState(null);
  const [nameOfDestination, setNameOfDestination] = useState(null);
  let counter = 0;

  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Retrieves heading information from device
  const findCurrentLocationAsync = async () => {
    console.log('findCurrentLocationAsync has been called');

    // Request foreground location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
    }

    // Get current lat/long
    Location.watchPositionAsync({ timeInterval: 1000, distanceInterval: 10 }, (position) => {
      console.log('position: ', position);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setLocation(position.coords);
    })

    fetchHeading();
  }

  const fetchHeading = async () => {
    Location.watchHeadingAsync((hdg) => {
      setHeading(hdg.trueHeading);
    });
  }

  // pings the server requesting the nearest bar given input arguments lat and long.
  const requestNearest = (lat, long) => {
    if (lat && long) {
      console.log('request to server made');
      const position = { lat: lat, lng: long };
      axios.post(serverUrl, { position: position, wantMost: "bar" })
        .then(({ data }) => {
          setBearing(data.bearing);
          setDistance(Math.trunc(data.distance));
          setNameOfDestination(data.name);
        }).catch((err) => {
          console.log('error in GET request to server: ', err);
        })
    }
  }

  useEffect(() => {
    requestNearest(latitude, longitude);
  }, [location]);

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
          <Text>Tap to begin</Text>
        )}
      </TouchableOpacity>

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

        <Image
          source={require('./assets/circle_compass.png')}
          style={[styles.compassDial, {transform: [{ rotate: `${bearing - heading} + 'deg`}]}]}
        />
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
  compassDial: {
    position: "absolute",
    resizeMode: "contain",
    height: "40%",
    zIndex: 2,
    top: "52%",
  },
});

/*
  Deprecated compass animation code:

  var rotateValue = new Animated.Value(0);
  var relativeBearing = bearing - heading;
  var rotation = rotateValue.interpolate({
    inputRange: [0, .5, .75, 1],
    outputRange: ["0deg", relativeBearing + 30 + 'deg', relativeBearing - 20 + 'deg', relativeBearing + 'deg'] // crude compass wobble simulation
  });

  var transformStyle = {
    transform: [{ rotate: rotation }],
    position: "absolute",
    resizeMode: "contain",
    height: "40%",
    zIndex: 2,
    top: "52%"
  };

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
        </TouchableWithoutFeedback>


*/