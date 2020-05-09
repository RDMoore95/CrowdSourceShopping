import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  ImageBackground
  } from 'react-native';
import { useEffect, useState } from 'react';
import {StoreFeed} from './components/storeFeed';

import { Block, Text, theme } from "galio-framework";
import { Button } from "../../components";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

// refactor for store feed... per store? 


export function StoreProfile( { route, navigation }, {} ) {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    // store_name, store_address, price_rating, crowd_rating, service_rating, store_rating are the data variables
    // I mocked - but feel free to change!

    useEffect(() => {
        // something like 4545/store/{data.store_id}?
      fetch('http://flip1.engr.oregonstate.edu:4545/profile')
        .then((response) => response.json())
        .then((json) => setData(json[0]))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
    }, []);

    return (    
      <Block flex style={styles.profile}>
        <Block flex>
          
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            > 
              <Block flex style={styles.profileCard}> 
                <Block middle style={styles.avatarContainer}>
                  <Image 
                    source={require('./Propic.png')}
                    style={styles.avatar}
                  
                  /> 
                </Block>
                <Block style={styles.info}>
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                    >
                    <Button small
                      style={{ backgroundColor: argonTheme.COLORS.INFO }}
                    >
                      RECCOMENDED STORE
                    </Button>
                  </Block> 

                  <Block row space="between">
                  <Text bold size={28} color="#32325D">
                      {data.store_rating}
                    </Text>
                  </Block>

                  <Block row space="between">
                    <Block middle>
                      <Text
                        bold
                        size={18}
                        color="#525F7F"
                        style={{ marginBottom: 4 }}
                      >
                         {data.price_rating}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Price Rating</Text>
                    </Block>
                    <Block middle>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        {data.crowd_rating}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Crowd Rating</Text>
                    </Block>
                    <Block middle>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        {data.service_rating}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Service Rating</Text>
                    </Block>
                    
                  </Block>

                </Block>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      Name: {data.store_name}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      Location: {data.store_address}
                    </Text>
                  </Block>
          
                  <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                    <Block style={styles.divider} />
                  </Block>
                  
                    <Button
                    color="transparent"
                      textStyle={{
                        color: "#233DD2",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    onPress={() => navigation.navigate('Feed')}
                    title="Feed"
                    
                    > Feed </Button>
                    <Button
                    color="transparent"
                      textStyle={{
                        color: "#233DD2",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    onPress={() => navigation.navigate('Map')}
                    title="Map"
                    
                    > Map </Button>
                    <Button
                    color="transparent"
                      textStyle={{
                        color: "#233DD2",
                        fontWeight: "500",
                        fontSize: 16
                      }}
                    onPress={() => navigation.navigate('Stores')}
                    title="Stores"
                    
                    > Stores </Button>
                  </Block>
                  <StoreFeed>
                    
                  </StoreFeed>
                  </Block>
              
            </ScrollView>
 
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
