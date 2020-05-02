//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Author: Henry Clay / Team Romanesco (Clay Moore Walker)
// Name: Romanesco (Spring 2020 Capstone - Waze for Grocery Stores)
// Description: A mobile app with a social rewards component to help locate the ideal shopping experience.
// This is the front end, written in React Native
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, ScrollView, Image, Button, View } from 'react-native';
import Feed from './app/screens/feed/feed';
import { UserProfile } from './app/screens/profile/profile';
import  Map  from './app/screens/map/map';
import  SignIn from './app/screens/signin/signin';
import  SignUp from './app/screens/signin/signup';
import { HomeScreen } from './app/screens/home/home';

//import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Main/Entry for app - Navigation Container provides navigation functionality
// Also includes navigation stack instantiation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Stack = createStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Feed">
        
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
            />
        
        <Stack.Screen
          name="Feed"
          component={Feed}
          
        />

        <Stack.Screen
          name="Map"
          component={Map}
          
        />

        <Stack.Screen 
          name="Profile" 
          component={UserProfile} 
          //options={{title: 'Name'}}
        />

        <Stack.Screen
          name="SignIn"
          component={SignIn}
          
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          
        />

      </Stack.Navigator>
    </NavigationContainer>
  );/*return (
    <NavigationContainer>{
      <View style={styles.container}>
        <Text>Home Screen</Text>
      </View>
    }</NavigationContainer>
  );*/
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// styles  
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });




