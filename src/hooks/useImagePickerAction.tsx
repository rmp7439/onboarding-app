import React, { useState, useRef } from 'react';
import { Platform, ActionSheetIOS } from 'react-native';
import ImagePickerModal from '../components/common/ImagePickerModal';

export function useImagePickerAction() {
  const [isModalVisible, setModalVisible] = useState(false);
  
  // Use a ref to store callbacks instead of state to prevent unnecessary re-renders
  const callbacks = useRef<{ onCamera: () => void, onGallery: () => void } | null>(null);

  const openPicker = (onCamera: () => void, onGallery: () => void) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', 'Take Photo', 'Choose from Gallery'], cancelButtonIndex: 0 },
        (buttonIndex) => {
          if (buttonIndex === 1) onCamera();
          if (buttonIndex === 2) onGallery();
        }
      );
    } else {
      callbacks.current = { onCamera, onGallery };
      setModalVisible(true);
    }
  };

  const handleCamera = () => {
    setModalVisible(false);
    if (callbacks.current) callbacks.current.onCamera();
  };

  const handleGallery = () => {
    setModalVisible(false);
    if (callbacks.current) callbacks.current.onGallery();
  };

  const PickerComponent = () => (
    <ImagePickerModal
      visible={isModalVisible}
      onClose={() => setModalVisible(false)}
      onCamera={handleCamera}
      onGallery={handleGallery}
    />
  );

  return { openPicker, PickerComponent };
}