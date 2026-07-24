import React, { useState, useRef } from 'react';
import { Platform, ActionSheetIOS, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ImagePickerModal from '../components/common/ImagePickerModal';
import { SharedCameraModal } from '../components/common/SharedCameraModal';
import { IMAGE_QUALITY } from '../constants/App';

export function useImagePickerAction() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [uploadType, setUploadType] = useState<'profile' | 'document'>('profile');
  
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');
  
  const callbacks = useRef<{ onSelect: (uri: string, filename: string) => void } | null>(null);

  const processResult = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const filename = asset.fileName || asset.uri.split("/").pop() || "image.jpg";
      if (callbacks.current) callbacks.current.onSelect(asset.uri, filename);
    }
  };

  const launchFrontCamera = () => {
    setModalVisible(false);
    setCameraFacing('front');
    setTimeout(() => setCameraVisible(true), Platform.OS === 'ios' ? 300 : 0);
  };

  const launchRearCamera = () => {
    setModalVisible(false);
    setCameraFacing('back');
    setTimeout(() => setCameraVisible(true), Platform.OS === 'ios' ? 300 : 0);
  };

  const launchGallery = async () => {
    setModalVisible(false);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Gallery access is required to choose photos.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: IMAGE_QUALITY,
        // Disable the native crop/preview screen for documents to instantly return the image
        allowsEditing: uploadType === 'profile', 
      });
      processResult(result);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to open gallery.");
    }
  };

  const openPicker = (type: 'profile' | 'document', onSelect: (uri: string, filename: string) => void) => {
    callbacks.current = { onSelect };
    setUploadType(type);
    
    if (Platform.OS === 'ios') {
      const options = type === 'profile' 
        ? ['Cancel', '📷 Take Selfie', '📸 Take Photo', '🖼 Choose from Gallery']
        : ['Cancel', '📸 Take Photo', '🖼 Choose from Gallery'];

      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 0 },
        (buttonIndex) => {
          if (type === 'profile') {
            if (buttonIndex === 1) launchFrontCamera();
            if (buttonIndex === 2) launchRearCamera();
            if (buttonIndex === 3) launchGallery();
          } else {
            if (buttonIndex === 1) launchRearCamera();
            if (buttonIndex === 2) launchGallery();
          }
        }
      );
    } else {
      setModalVisible(true);
    }
  };

  const PickerComponent = () => (
    <>
      <ImagePickerModal
        visible={isModalVisible}
        uploadType={uploadType}
        onClose={() => setModalVisible(false)}
        onFrontCamera={launchFrontCamera}
        onRearCamera={launchRearCamera}
        onGallery={launchGallery}
      />
      <SharedCameraModal
        visible={isCameraVisible}
        cameraFacing={cameraFacing}
        onClose={() => setCameraVisible(false)}
        onCapture={(uri: string, filename: string) => {
          setCameraVisible(false);
          if (callbacks.current) callbacks.current.onSelect(uri, filename);
        }}
      />
    </>
  );

  return { openPicker, PickerComponent };
}