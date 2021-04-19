import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Constants } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import axios from 'axios';

export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [heading, setHeading] = useState(null);

  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  /*
  const findCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = JSON.stringify(position.coords.latitude);
        const long = JSON.stringify(position.coords.longitude);

        setLatitude(lat);
        setLongitude(long);
      }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }
  */

  const findCurrentLocationAsync = async () => {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      setPermissionGranted(true);
    }

    let location = await Location.getCurrentPositionAsync({})

    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setHeading(location.coords.heading);
    setLocation(JSON.stringify(location));
  }

  const requestNearest = () => {
    console.log('requestNearest has been called');
    const position = {lat: latitude, lng: longitude};
    axios.post(`http://localhost:8000/`, { position: position, wantMost: "bar" })
    .then(({ data }) => {
      console.log('Bearing to destination: ', data.bearing);
      // setBearing(data.bearing);
      // console.log('Data from server: ', data);
    }).catch((err) => {
      console.log('error in GET request to server: ', err);
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={findCurrentLocationAsync}>
        <Text>Where Am I?</Text>
        {permissionGranted ? (
          <View>
            <Text>latitude: {latitude}</Text>
            <Text>longitude: {longitude}</Text>
            <Text>heading: {heading}</Text>
          </View>) : (
          <Text> Location denied </Text>
        )}

        <StatusBar style="auto" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Text onPress={requestNearest}> requestNearest </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
