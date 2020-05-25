import React, { useState, useEffect } from 'react';
import { StyleSheet,
  Text,
  View,
  Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { theme } from "galio-framework";

let deviceWidth = Dimensions.get('window').width

export default function InputBarcode() {

  const navigation = useNavigation();
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  handleBarCodeScanned = ({ type, data }) => {
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    let barcodeType = type;
    let barcodeData = data;
    navigation.navigate("InputBarcodeScanned", {barcodeData: barcodeData})
    // navigation.navigate("InputBarcodeScanned", {barcodeData: '37000940203'})
    // navigation.navigate("InputBarcodeScanned", {barcodeData: '1234'})
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return(
      

    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        // justifyContent: 'flex-end',
      }}>

      <View style={{backgroundColor:'#fff', padding: 10}}></View>      

      <View style={styles.feedBox}>
      <Text> Hold up item barcode to scan </Text>
      </View>

      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );

}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'column',
    },
    col:{
      //flex: 1,
      backgroundColor: '#5E72E4',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'row'
    },
    row:{
      //flex: 1,
      backgroundColor: '#5E72E4',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'column'
    },
    feedBox: {
      backgroundColor:'#fff'
      , paddingHorizontal: 6
      , paddingVertical: 12
      , marginHorizontal: theme.SIZES.BASE
      , borderColor: '#fff'
      , borderRadius: 10
      , borderWidth: 1
      , shadowColor: "black"
      , shadowOffset: { width: 0, height: 0 }
      , shadowRadius: 8
      , shadowOpacity: 0.2
      , zIndex: 2
      , width: deviceWidth * 0.9
    },
    feedBoxHeader: {
      backgroundColor:'#fff'
      , padding: 3
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReview: {
      backgroundColor:'#fff'
      , padding: 3
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReviewText: {
      backgroundColor:'#fff'
      , padding: 3
      , flex: 0.9
    },
    feedBoxReviewVote: {
      backgroundColor:'#fff'
      , flex: 0.1
    },                    
    headline: {
       fontSize: 20,
       color:'#32325D',
       textAlign: 'center',
       textAlignVertical: "center",
       paddingLeft: 10,
       width: deviceWidth * 0.75
    }
  });
