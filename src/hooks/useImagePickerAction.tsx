import React, { useState } from 'react';
import { Platform, ActionSheetIOS } from 'react-native';
import ImagePickerModal from '../components/common/ImagePickerModal';

export function useImagePickerAction() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [callbacks, setCallbacks] = useState<{ onCamera: () => void, onGallery: () => void } | null>(null);

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
      setCallbacks({ onCamera, onGallery });
      setModalVisible(true);
    }
  };

  const handleCamera = () => {
    setModalVisible(false);
    if (callbacks) callbacks.onCamera();
  };

  const handleGallery = () => {
    setModalVisible(false);
    if (callbacks) callbacks.onGallery();
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