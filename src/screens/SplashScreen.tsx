import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';

const SplashScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useEffect(() => {
      const timer = setTimeout(() => {
        navigation.replace('Home'); // use replace to prevent back navigation to splash
      }, 2000);
  
      return () => clearTimeout(timer); // clean up on unmount
    }, []);
  return (
    <View style={styles.container}>
      {/* Simulated Reel View or Logo */}
      <Text style={styles.reel}>🎞️</Text>
      <Text style={styles.text}>SplashScreen</Text>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      },
      reel: {
        fontSize: 50,
        marginBottom: 10,
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
      },
})