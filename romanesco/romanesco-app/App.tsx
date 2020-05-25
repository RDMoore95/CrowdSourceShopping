//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Author: Henry Clay / Team Romanesco (Clay Moore Walker)
// Name: Romanesco (Spring 2020 Capstone - Waze for Grocery Stores)
// Description: A mobile app with a social rewards component to help locate the ideal shopping experience.
// This is the front end, written in React Native
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Alert, Text, ScrollView, Image, Button, View, TouchableOpacity } from 'react-native';
import Feed from './app/screens/feed/feed';
import { UserProfile } from './app/screens/profile/profile';
import  Map  from './app/screens/map/map';
import  Stores  from './app/screens/stores/stores';
import  SignIn from './app/screens/signin/signin';
import  SignUp from './app/screens/signin/signup';
import  { StoreProfile } from './app/screens/stores/storeProfile';
import  ReviewList from './app/screens/reviews/reviewList';
import { NewButton } from './app/components/newButton/newButton';
import { HomeScreen } from './app/screens/home/home';
import { ShoppingList } from './app/screens/shoppingList/shoppingListEdit';
import { ShoppingListList } from './app/screens/shoppingList/shoppingListList';

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
      <MainStack.Navigator initialRouteName="Romanesco" >
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
          options={{ headerLeft: null }}
        />
      
      </MainStack.Navigator>
    </NavigationContainer>
  );

}

function Tabs() {
   
  return (
        <Tab.Navigator initialRouteName="Home" 
          tabBarOptions={{
            labelStyle: { fontSize: 11.5 },
            // tabStyle: { width: 100 },
            // style: { backgroundColor: 'powderblue' },
          }}
        >
          <Tab.Screen
            name="Home" 
            component={HomeTabNav}
          />

          <Tab.Screen
            name="Feed"
            component={FeedTabNav}
          />

          <Tab.Screen
            name="Map"
            component={MapTabNav}
          />

          
          <Tab.Screen
            name="Stores"
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
          options={{ headerShown: false }}
        />
        <HomeStack.Screen 
          name="ShoppingList" 
          component={ShoppingList}
          options={{ headerShown: false }}
        />
        <HomeStack.Screen 
          name="ShoppingListList" 
          component={ShoppingListList}
          options={{ headerShown: false }}
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
          options={{ headerShown: false }}
        />
        <FeedStack.Screen 
          name="NewButton"
          component={NewButton}
          options={{ headerShown: false,
           }}
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
          options={{ headerShown: false }}
        />

      </MapStack.Navigator>
    );
}

const StoreStack = createStackNavigator();

function StoreTabNav() {

  return (  
      <StoreStack.Navigator mode="modal">
        <StoreStack.Screen 
          name="Stores"
          component={Stores}
          options={{ headerShown: false }}
        />
        <StoreStack.Screen 
          name="StoreProfileModal"
          component={StoreProfile}
          options={{ headerShown: false,
            gestureDirection: 'vertical',
            swipeVelocityImpact: 10,
            springVelocityScale: 4,
           }}
        />
      </StoreStack.Navigator>
    );
}

        // <StoreStack.Screen
        //     name="StoreProfile"
        //     component={StoreProfile}
        //     options={{ headerShown: false }}
        // />


const ProfileStack = createStackNavigator();

function ProfileTabNav() {

  return (
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ headerShown: false }}          
        />
        <ProfileStack.Screen
            name="ReviewList"
            component={ReviewList}
            options={{ headerShown: false }}
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
