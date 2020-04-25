//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Author: Henry Clay / Team Romanesco (Clay Moore Walker)
// Name: Romanesco (Spring 2020 Capstone - Waze for Grocery Stores)
// Description: A mobile app with a social rewards component to help locate the ideal shopping experience.
// This is the front end, written in React Native
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, ScrollView, Image, Button, View } from 'react-native';
import { Feed } from './app/screens/feed/feed';
import { UserProfile } from './app/screens/profile/profile';
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
          name="Profile" 
          component={UserProfile} 
          //options={{title: 'Name'}}
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

function HomeScreen({ navigation}) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
          title="Profile"
          color="#000"
          onPress={() => {
            navigation.navigate("Profile", {
            name: "testName",
            karma: 710,
          });
        }}
      />
      <Button
                onPress={() => navigation.navigate("Feed")}
                title="Feed"
                color="#000"
              />
    </View>
  );
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Navigation Function
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Feed"
          component={Feed}
          
        />
        <Stack.Screen 
          name="Profile" 
          component={UserProfile} 
          //options={{title: 'Name'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

*/

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




