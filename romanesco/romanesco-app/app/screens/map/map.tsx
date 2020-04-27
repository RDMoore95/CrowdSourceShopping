import React from 'react';
import { StyleSheet, Text, View, Button,  Dimensions } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
//import { Marker } from 'react-native-maps';

export function Map( { navigation } ) {
    return (
      <View style={styles.container}>
        <MapView 
        initialRegion={{ // placeholder - replace with location (get location)
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        provider={PROVIDER_GOOGLE}
        style={styles.mapStyle} 
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

}

// taaken from react-native-maps example snack

const styles = StyleSheet.create({
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