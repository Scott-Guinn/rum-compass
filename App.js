import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  Image,
} from 'react-native';
import axios from 'axios';
import AppLoading from 'expo-app-loading';
import * as Location from 'expo-location';
import ArrivedModal from './ArrivedModal.js';

const serverUrl = 'https://salty-beyond-02367.herokuapp.com/';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [heading, setHeading] = useState(0);
  const [bearing, setBearing] = useState(0);
  const [distance, setDistance] = useState(null);
  const [nameOfDestination, setNameOfDestination] = useState(null);

  const [location, setLocation] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [showDetails, setShowDetails] = useState(false);

  // This function retrieves heading and location information from the device when prompted by user press
  const handlePress = async () => {
    // Request foreground location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
    }
    // Subscribe to current position of device
    await fetchLocation();
    // Subscribe to current heading of device
    await fetchHeading();
  }

  const fetchLocation = () => {
    // timeInterval is minimum time between updates (milliseconds)
    // distanceInterval is minimum distance between updates (meters)
    Location.watchPositionAsync({ timeInterval: 1000, distanceInterval: 10 }, (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setLocation(position.coords);
    });
  }

  const fetchHeading = () => {
    Location.watchHeadingAsync((hdg) => {
      setHeading(hdg.magHeading);
    });
  }

  // Pings the server requesting the nearest "bar" given input lat and long
  const requestNearest = (lat, long) => {
    if (lat && long) {
      console.log('request to server made');
      const position = { lat: lat, lng: long };
      axios.post(serverUrl, { position: position, wantMost: "casey middle school" })
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
    if (distance !== null && distance <= 50) {
      setModalVisible(true);
    }
  }, [location]);

  if (!isReady) {
    return (
      <AppLoading
        startAsync={handlePress}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  } else {
    return (
      <SafeAreaView style={styles.container} >
        {/* displays ArrivedModal if modalVisible is true */}
        {modalVisible ? <ArrivedModal modalVisible={modalVisible} setModalVisible={setModalVisible} destination={nameOfDestination} /> : null}

        {showDetails && (

        <TouchableOpacity
          onPress={() => setShowDetails(!showDetails)}
          style={styles.detailsView}>

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
            <Text>Location permissions not granted.</Text>
          )}

        </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
          <Text>Click to display details</Text>
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
            style={[styles.compassDial, { transform: [{ rotate: `${bearing - heading}deg` }] }]}
          />
        </View>
      </SafeAreaView >
    );
  }
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
  detailsView: {
    backgroundColor: "darkorange",
    flex: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: 'center'
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
