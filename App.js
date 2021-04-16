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
  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

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

  const findCurrentLocationAsync = async () => {

    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      setPermissionGranted(true);
    }

    let location = await Location.getCurrentPositionAsync({})
    setLocation(JSON.stringify(location));
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={findCurrentLocationAsync}>
        <Text>Where Am I?</Text>
        {permissionGranted ? (
          <View>
            <Text>{location}</Text>
          </View>) : (
          <Text> Location denied </Text>
        )}

        <StatusBar style="auto" />
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
