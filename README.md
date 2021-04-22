# Rum Compass is a compass that doesn't point North

But we're not trying to find North, are we!

Ultimately this compass will point the user towards the nearest bar where he can refill his drink.

## Tech

- React Native
- Designed in Expo
- expo-location
- Animate API (Included with React Native)
- Utilizes an external server that I set up for the web version of this app which communicates with the Google Maps API.

### Next Steps (App development is in progress):
- create a modal for when user arrives at destination (or within 500 feet)
- get android simulator up and running
- hide location info unless asked to display

- refactor calculateDistance & calculateBearing to the frontend or a separate route so API request is not made for simple recalculations

Backlog:
- spin the compass or otherwise show that the app is loading while calculating bearing