import React from 'react';
import { StyleSheet, Text, View, Button,  Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
//import { Marker } from 'react-native-maps';

import { useNavigation } from '@react-navigation/native';

export default class Map extends React.Component {
  //navigation = useNavigation();

  state = {
      
    }


    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }
  
  /* //tutorial code at this point from https://reactnative.dev/docs/network
  function getFeed( ) {
    return fetch('https://.com/endpoint/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),  
    }).then((response) => response.json())
    .then((json) => {
      return json.feed;
    })
    .catch((error) => {
      console.error(error);
    });
    } 
  }
  */

  // need getFeed() to get iterated over and generate FeedEntries 

  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapStyle: {
  
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });

 render() {
  return (
      <View style={this.styles.container}>
        <MapView 
        initialRegion={{ // placeholder - replace with location (get location)
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        provider={PROVIDER_GOOGLE}
        style={this.styles.mapStyle} 
        /*> // markers code from react-native-maps docs - loads our markers!
        {this.state.markers.map(marker => (
            <Marker
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />*/
        />
      </View>
    );



// taaken from react-native-maps example snack

                }
              }
