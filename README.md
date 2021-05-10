# Where is the Rum? (previously known as Rum Compass) is a compass that doesn't point North

But we're not trying to find North, are we!

This mobile application will point the user towards the nearest bar where the user can refill their drink.

The application works through communication with a custom Where-is-the-Rum API (also viewable on my GitHub) which calculates distance and bearing based on user's lat/long and the nearest relevant location retrieved via Google Places API.

Upon arrival, the app will let you know you've made it.

<img src="/screen-shot_details.png" alt="screenshot" width="200"/>
<!-- ![Alt text](/screen-shot_details.png "Screenshot") -->

## Currently Deployed To Google Play Store!

## Tech

- React Native
- Designed in Expo for cross-functionality on iOS and Android
- expo-location
- Animate API (Included with React Native)
- Utilizes an external server that I set up for the web version of this app which communicates with the Google Maps API.

### Future Features:

- Refactor calculateDistance & calculateBearing to the frontend or a separate route so API request is not made for simple recalculations
- Compass will spin if location services are not allowed