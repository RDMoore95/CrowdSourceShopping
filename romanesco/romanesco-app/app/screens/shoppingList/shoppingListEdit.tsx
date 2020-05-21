import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  FlatList
  } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Block, Text, theme } from "galio-framework";
import { Button } from "../../components";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export function ShoppingList( { route, navigation }, {} ) {

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#000",
            }}
          />
        );
      }
    
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    /*
    const data = {
        "TP" : {name: "TP", price: "0.99", quantity: "1", units: "package"}, 
        "Yeast" : {name: "Yeast", price: "1.00", quantity: "3", units: "package"}, 
        "Bagged.Potatoes" : {name: "Potatoes", price: "5.00", quantity: "5", units: "LBs"}
    }
    */
    useEffect(() => {
      fetch('http://flip1.engr.oregonstate.edu:4545/user/shoppinglists/list')
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
    }, []);

    return (    
      <Block flex style={styles.profile}>
        <Block flex>


              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>
                <Text size={28} color="#32325D" style={{ marginTop: 10 }}>
                      Shopping List
                    </Text>
                                                                                              

                </Block>
                
                <Block>
                    <View style={{ flex: 1, padding: 24 }}>
                       
                            <FlatList
                                data={data}
                                ItemSeparatorComponent = {FlatListItemSeparator}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text>Name: {item.name}</Text>
                                        <Text>Price: {item.price}</Text>
                                    </View>
                              )}
                            />

                        </View>
                </Block>
                
                
              </Block>

        </Block>
      </Block>

        )
};

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});
