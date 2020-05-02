import React from 'react';
import { StyleSheet, Text, View, Button,  ScrollView } from 'react-native';
import { FeedEntry } from './components/feedEntry';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export default class Feed extends React.Component {
  const navigation = useNavigation();

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

 render() {
  return (
        <View style={this.styles.container}>
            <ScrollView>
                

                <FeedEntry></FeedEntry>
                <FeedEntry></FeedEntry>
                <FeedEntry></FeedEntry>
                <FeedEntry></FeedEntry>
                <FeedEntry></FeedEntry>
                <Button
                    title="Profile"
                    color="#000"
                    onPress={() => {
                      this.navigation.navigate("Profile", {
                      name: "testName",
                      karma: 710,
                    });
                  }}
                />
                <Button
                onPress={() => this.navigation.navigate('Home')}
                title="Home"
                color="#000"
                />
                <Button
                onPress={() => this.navigation.navigate("Map")}
                title="Map"
                color="#000"
              />
            </ScrollView>
        </View>
    )
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}



