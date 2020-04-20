import React from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export function UserProfile( { navigation } ) {
    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={require('./Propic.png')} > </Image>
                <Text>Name:</Text>
                <Text>Karma: </Text>
                <Button
                onPress={() => navigation.navigate('Feed')}
                title="Profile"
                color="#fff"
              />
      <Button
                onPress={() navigation.navigate('Home')}
                title="Feed"
                color="#fff"
              />

            </ScrollView>
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