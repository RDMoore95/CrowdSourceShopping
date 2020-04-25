import React from 'react';
import { Text, View, Button,  ScrollView } from 'react-native';


export function FeedEntry( { } ) {
    return (
        <View style={{flex: 1, flexDirection: 'column'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <Text>Name: $N</Text>
                <Text>Karma: $K</Text>
            </View> 
            <View style={{flex: 1, flexDirection: 'row'}}>
                <Text>Store Name: </Text>
                <Text>Rating: </Text>
            </View> 
            <View style={{flex: 1, flexDirection: 'column'}}>
                <Text>Grocery Trip Review: </Text>
                <Text>Lorem Ipsum Sic Dolor Amut I think?</Text>
            </View> 
        </View>
       
    );
}