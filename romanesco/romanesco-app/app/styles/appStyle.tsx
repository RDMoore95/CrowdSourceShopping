import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
      },
  
      TouchableOpacityStyle: {
        position: 'absolute',
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
      },
    
      FloatingButtonStyle: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
        //backgroundColor:'black'
      },
      listButton: {

        width: width * .8,
        height: height * .1,
        color: theme.COLORS.GREEN
    },
    listRow: {
        width: width*.85,
        flexDirection: 'row',
        alignContent: 'stretch',
        justifyContent: 'space-between'
      },
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }, 
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#5E72E4',
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
    backgroundColor:'#F7FAFC'
    , padding: 3
    , borderColor: '#F7FAFC'
    , borderRadius: 25
    , borderWidth: 1
  },
  feedBoxHeader: {
    backgroundColor:'#F7FAFC'
    , padding: 3
    , borderColor: '#F7FAFC'
    , borderRadius: 25
    , borderWidth: 1
    , flexDirection: 'row'
    , alignItems: 'center'
  },    
  feedBoxReview: {
    backgroundColor:'#F7FAFC'
    , padding: 3
    , borderColor: '#F7FAFC'
    , borderRadius: 25
    , borderWidth: 1
    , flexDirection: 'row'
    , alignItems: 'center'
  },    
  feedBoxReviewText: {
    backgroundColor:'#F7FAFC'
    , padding: 3
    , borderColor: '#F7FAFC'
    , borderRadius: 25
    , borderWidth: 1
    , flex: 0.9
  },
  feedBoxReviewVote: {
    backgroundColor:'#F7FAFC'
    , borderColor: '#F7FAFC'
    , borderRadius: 25
    , borderWidth: 1
    , flex: 0.1
  },                    
  headline: {
     fontSize: 14,
     color:'#32325D',
     textAlign: 'left',
     textAlignVertical: "center",
     paddingLeft: 10,
     width: deviceWidth * 0.75
  },
  storeHeadline: {
     fontSize: 20,
     color:'#32325D',
     textAlign: 'left',
     textAlignVertical: "center",
     paddingLeft: 10,
     width: deviceWidth * 0.75
  },

    tag1: {flex: 1, color: theme.COLORS.LIGHT_GREEN},
    tag2: {flex: 1, color: theme.COLORS.GREEN},
    tag3: {flex: 1, color: theme.COLORS.DARK_GREEN},
    listButton: {
        width: width * .8,
        height: height * .1,
        color: theme.COLORS.GREEN
    },
  listRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }, 
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  profile: {
    backgroundColor:'#fff',
    flex: 1,
  },
  profileContainer: {
    height: height,
    padding: 0,
    zIndex: 1,
    width: deviceWidth * 0.8,
    backgroundColor:'#fff',
  },
  profileBackground: {
    width: deviceWidth * 0.8,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderRadius: 10,
    borderWidth: 1,
    // borderTopLeftRadius: 6,
    // borderTopRightRadius: 6,
    borderColor: '#F7FAFC',
    backgroundColor: '#fff',
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
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
    height: thumbMeasure,
    backgroundColor:'#fff'
  },
  });
