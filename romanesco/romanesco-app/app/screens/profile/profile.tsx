import React from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export function UserProfile( { route, navigation }, {} ) {

    const { name } = route.params;
    const { karma } = route.params;
    return (
        <View style={styles.container}>
            <ScrollView>
                <Image source={require('./Propic.png')} ></Image>
                <Text>Name: {JSON.stringify(name)}</Text>
                <Text>Karma: {JSON.stringify(karma)}</Text>
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