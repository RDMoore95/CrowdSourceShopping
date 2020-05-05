import React, {Component} from 'react';
import { StyleSheet, Text, View, Button,  Dimensions, ActivityIndicator, FlatList} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { Marker } from 'react-native-maps';

import { useNavigation } from '@react-navigation/native';

export default class Map extends Component {
  //navigation = useNavigation();

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true
    };
  }

  componentDidMount() {
    fetch('http://flip1.engr.oregonstate.edu:4545/map')
      .then((response) => response.json())
      .then((json) => {
        this.setState( {data: json });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      })
  }


    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }

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

  const {data, isLoading } = this.state;
  

  return (
      <View style={this.styles.container}>
        {isLoading ? <ActivityIndicator/> : (
          
          <FlatList
          data={data}
          renderItem={({ item }) => (
            <View>
                <Text>{item.store_street}</Text>
                <Text>{item.store_city}</Text>
                </View>
          )}
        />
          // <MapView 
          // initialRegion={{ // placeholder - replace with location (get location)
          //     latitude: 37.78825,
          //     longitude: -122.4324,
          //     latitudeDelta: 0.0922,
          //     longitudeDelta: 0.0421,
          //   }}
          // provider={PROVIDER_GOOGLE}
          // style={this.styles.mapStyle} 
          // /*> // markers code from react-native-maps docs - loads our markers!
          // {this.state.markers.map(marker => (
          //     <Marker
          //       coordinate={marker.latlng}
          //       title={marker.title}
          //       description={marker.description}
          //     />*/
          // />
        )}   
      </View>
    );



// taaken from react-native-maps example snack

   
        }
}