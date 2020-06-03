import React, {Component} from 'react';
import { StyleSheet, 
  Text, 
  View, 
  Button, 
  Dimensions, 
  AsyncStorage,
  ActivityIndicator, 
  FlatList} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Callout, CalloutSubview } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { Marker } from 'react-native-maps';
import Modal from 'react-native-modal';
import{ StoreProfile } from "../stores/storeProfile";
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {NewButton} from "../../components/newButton/newButton";
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { color } from 'react-native-reanimated';

const USER_STORAGE_KEY = "@user_id";

export default class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      coordinates_received: false,
      user_id: ""
    };

    this.getUserId()
      .then(() => {
    fetch('http://flip1.engr.oregonstate.edu:4545/map')
      .then((response) => response.json())
      .then((json) => {
        this.setState( {markers: json });
        this.findCoordinates();
        //console.log(this.state.markers)
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.setState({ isLoading: false });
      })
    })

  }

  getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem(USER_STORAGE_KEY);
      this.setState({['user_id']: value});
      this.setState({['haveUserId']: true});
    }
    catch {
      console.log("failed to get userId");
    }
  }  

  findCoordinates = async () => {

    let { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      console.log("location permission denied");
    }

    else {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({lat: Number(location.coords.latitude)});
      this.setState({long: Number(location.coords.longitude)});
      this.setState({coordinates_received: true});
      // console.log(this.state.lat, this.state.long);
      // console.log("number", Number(this.state.lat), Number(this.state.long));
    }
    
  };

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

    const {markers, isLoading, lat, long, coordinates_received} = this.state;    
 
    return (
      <View style={this.styles.container}>
        {isLoading || !coordinates_received ? <ActivityIndicator/> : (

          <MapView 
          initialRegion={{ // placeholder - replace with location (get location)
              latitude: lat,
              longitude: long,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          provider={PROVIDER_GOOGLE}
          style={this.styles.mapStyle} 
            >
          {markers.map(marker => (
            <Marker key={marker.store_id}
                coordinate={{ latitude: marker.store_lat, 
                              longitude: marker.store_long}}
                title={marker.store_name}>

              <Callout
                onPress={() => this.props.navigation.navigate('StoreProfileModal', 
                {
                  store_id: marker.store_id,
                  store_street: marker.store_street,
                  store_city: marker.store_city,
                  user_id: this.state.user_id,
                }
              )
              }>
                <Text> {marker.store_name} </Text>
                <Text> {marker.store_street} </Text>
                <TouchableOpacity>
                  <Text style={styles.viewStoreText}>Touch View Store Details</Text>
                </TouchableOpacity>
              </Callout>

            </Marker>
        ))}

        </MapView>
        )}   
        <NewButton />        
      </View>
      );
   
     }
  }

  const styles = StyleSheet.create({
    viewStoreText: {
      fontSize: 16,
      color: "blue"
    }
  });