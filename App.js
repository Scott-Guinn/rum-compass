import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Constants } from 'expo';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

import axios from 'axios';

export default function App() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [heading, setHeading] = useState(null);
  const [bearing, setBearing] = useState(null);

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
    let bearing = await requestNearest(location.coords.latitude, location.coords.longitude);

    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setHeading(location.coords.heading);
    setLocation(JSON.stringify(location));
  }

  const requestNearest = (lat, long) => {
    console.log('requestNearest has been called: ', lat, long);

    const position = {lat: lat, lng: long};
    axios.post(`http://localhost:8000/`, { position: position, wantMost: "bar" })
    .then(({ data }) => {
      console.log('Bearing to destination: ', data.bearing);
      setBearing(data.bearing);
    }).catch((err) => {
      console.log('error in GET request to server: ', err);
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{
        backgroundColor: "darkorange",
        flex: 1,
        justifyContent: "center",
        width: "100%",
        alignItems: 'center'
      }}
        onPress={findCurrentLocationAsync}>
        <Text style={{fontWeight: 'bold'}}>Where Am I?</Text>
        {permissionGranted ? (
           <View>
            <Text>latitude: {latitude}</Text>
            <Text>longitude: {longitude}</Text>
            <Text>heading: {heading}</Text>
            <Text>bearing: {bearing}</Text>
          </View>) : (
          <Text> No location </Text>
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
          style={{height: "100%", width: "100%", backgroundColor: "grey", resizeMode: "contain"}} />
        <Image
          source={require('./assets/circle_compass.png')}
          style={{position: "absolute",
          resizeMode: "contain",
          height: "40%",
          zIndex: 2,
          top: "52%",
          transform: [{ rotate: `${bearing - heading}deg` }]
        }}
        />
      </View>
    </View>
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
});
