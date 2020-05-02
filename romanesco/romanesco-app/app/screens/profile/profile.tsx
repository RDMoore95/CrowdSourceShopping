import React from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView, ActivityIndicator} from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// how are we doing accounts?

function getProfileData() {
  return fetch('http://flip1.engr.oregonstate.edu:4545/profile')
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
}


export function UserProfile( { route, navigation }, {} ) {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
      fetch('https://192.168.0.11:4545/profile')
        .then((response) => response.json())
        .then((json) => setData(json[0]))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
    }, []);

    const { name } = route.params;
    const { karma } = route.params;
    return (
        <View style={styles.container}>
          {isLoading ? <ActivityIndicator/> : (
            <ScrollView>
              data = {data}
            <Image source={require('./Propic.png')} ></Image>
            <Text>Name: {data.first_name + data.last_name}</Text>
            <Text>Karma: {JSON.stringify(data.karma)}</Text>
            <Button
            onPress={() => navigation.navigate('Feed')}
            title="Feed"
            color="#000"
          />
    <Button
            onPress={() => navigation.navigate('Home')}
            title="Home"
            color="#000"
          />
    <Button
            onPress={() => navigation.navigate("Map")}
            title="Map"
            color="#000"
          />
        </ScrollView>
          )}
            
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });