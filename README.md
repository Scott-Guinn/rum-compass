# Rum Compass is a compass that doesn't point North

But we're not trying to find North, are we!

<img src="/screen-shot_details.png" alt="screenshot" width="200"/>
<!-- ![Alt text](/screen-shot_details.png "Screenshot") -->

## 🧪🧪🧪 Currently in BETA TESTING 🧪🧪🧪
This will point the user towards the nearest bar where he can refill his drink.
Upon arrival, the app will let you know you've made it.

## Tech

- React Native
- Designed in Expo for cross-functionality on iOS and Android
- expo-location
- Animate API (Included with React Native)
- Utilizes an external server that I set up for the web version of this app which communicates with the Google Maps API.

### Next Dev Steps:

- refactor calculateDistance & calculateBearing to the frontend or a separate route so API request is not made for simple recalculations

Backlog:
- spin the compass if location services are not enabled