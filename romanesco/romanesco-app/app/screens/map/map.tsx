import React, {Component} from 'react';
import { StyleSheet, Text, View, Button,  Dimensions, ActivityIndicator, FlatList} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { Marker } from 'react-native-maps';

import { useNavigation } from '@react-navigation/native';
import {NewButton} from "../../components/newButton/newButton";

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
        this.setState( {markers: json });
        //console.log(this.state.markers)
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
    
    const { data, isLoading } = this.state;
  
    return (
      <View style={this.styles.container}>
        {isLoading ? <ActivityIndicator/> : (

          <MapView 
          initialRegion={{ // placeholder - replace with location (get location)
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          provider={PROVIDER_GOOGLE}
          style={this.styles.mapStyle} 
            >
          {this.state.markers.map(marker => (
            <Marker
                coordinate={{ latitude: marker.store_lat, 
                              longitude: marker.store_long}}
                title={marker.store_name}>

              <Callout>
                <Text> {marker.store_name} </Text>
                <Text> {marker.store_street} </Text>
                <Button
                  title="View Store Info"
                ></Button>
              </Callout>

            </Marker>
        ))}

        </MapView>
        )}   
        <NewButton />        
      </View>
      );
  
  
  
  // taaken from react-native-maps example snack
  
     
          }
  }