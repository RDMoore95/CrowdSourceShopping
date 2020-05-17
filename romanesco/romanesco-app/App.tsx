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
import  Stores  from './app/screens/stores/stores';
import  SignIn from './app/screens/signin/signin';
import  SignUp from './app/screens/signin/signup';
import  { StoreProfile } from './app/screens/stores/storeProfile';
import  ReviewList from './app/screens/reviews/reviewList';
import { HomeScreen } from './app/screens/home/home';


//import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Main/Entry for app - Navigation Container provides navigation functionality
// Also includes navigation stack instantiation
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const MainStack = createStackNavigator( );


export default function App() {
  return (
    
    <NavigationContainer>
      <MainStack.Navigator>
      <MainStack.Screen
          name="SignIn"
          component={SignIn}
          
        />

        <MainStack.Screen
          name="SignUp"
          component={SignUp}
          
        />
        <MainStack.Screen
          name="Romanesco"
          component= {Tabs}
        />
      
      </MainStack.Navigator>
    </NavigationContainer>
  );/*return (
    <NavigationContainer>{
      <View style={styles.container}>
        <Text>Home Screen</Text>
      </View>
    }</NavigationContainer>
  );*/
}

function Tabs() {

  return (
        <Tab.Navigator initialRouteName="Home">

          <Tab.Screen 
            name="HomeTab" 
            component={HomeTabNav}
              />

          <Tab.Screen
            name="FeedTab"
            component={FeedTabNav}

          />

          <Tab.Screen
            name="MapTab"
            component={MapTabNav}

          />

          

          <Tab.Screen
            name="StoreTab"
            component={StoreTabNav}

          />

          

          <Tab.Screen 
            name="Profile" 
            component={ProfileTabNav} 
            //options={{title: 'Name'}}
          />
        </Tab.Navigator>
  );
}

const HomeStack = createStackNavigator();

function HomeTabNav() {

  return (
      <HomeStack.Navigator>
        <HomeStack.Screen 
          name="Home" 
          component={HomeScreen}
        />
      </HomeStack.Navigator>
    );
}

const FeedStack = createStackNavigator();

function FeedTabNav() {

  return (
      <FeedStack.Navigator>
        <FeedStack.Screen 
          name="Feed"
          component={Feed}
        />
      </FeedStack.Navigator>
    );
}

const MapStack = createStackNavigator();

function MapTabNav() {

  return (
      <MapStack.Navigator>
        <MapStack.Screen 
          name="Map"
          component={Map}
        />

      </MapStack.Navigator>
    );
}

const StoreStack = createStackNavigator();

function StoreTabNav() {

  return (  
      <StoreStack.Navigator>
        <StoreStack.Screen 
          name="Stores"
          component={Stores}
        />
        <StoreStack.Screen
            name="StoreProfile"
            component={StoreProfile}

        />
      </StoreStack.Navigator>
    );
}

const ProfileStack = createStackNavigator();

function ProfileTabNav() {

  return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name="UserProfile"
          component={UserProfile}
        />
        <ProfileStack.Screen
            name="ReviewList"
            component={ReviewList}

          />
      </ProfileStack.Navigator>
    );
}

const ShoppingListStack = createStackNavigator();
/*
function ShoppingListTabNav() {

  return (

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




