import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import { UploadService } from './services/upload';

const screen = Dimensions.get('screen');

export default function App() {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImageInfo | null>(null);

  const openImagePickerAsync = async (): Promise<void> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }
    setSelectedImage(pickerResult);

    try {
      const result = await UploadService.uploadImage(pickerResult.uri);
      if (result.status === 201) {
        Toast.show('upload was successful!', {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RootSiblingParent>
      <View style={styles.container}>
        <StatusBar />
        <Image
          source={{ uri: selectedImage?.uri ?? 'https://source.unsplash.com/random' }}
          style={{
            ...styles.logo,
            width: screen.width,
            height: 400,
          }}
        />
        <Text style={styles.instructions}>
          To share a photo from your phone with a friend, just press the button below!
        </Text>

        <TouchableOpacity onPress={openImagePickerAsync} style={styles.button}>
          <Text style={styles.buttonText}>Pick a photo</Text>
        </TouchableOpacity>
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    color: '#000',
    textAlign: 'center',
    margin: 30,
  },
  logo: {
    resizeMode: 'contain',
    margin: 10,
  },
  button: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 20,
  },
  buttonText: {
    color: '#fff',
  },
});
