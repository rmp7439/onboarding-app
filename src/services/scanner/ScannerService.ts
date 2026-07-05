import * as ImagePicker from 'expo-image-picker';
import { ScanResult } from '../../types/Document';
import { IMAGE_QUALITY } from '../../constants/App';

export interface ScannerService {
  pickFromGallery(): Promise<ScanResult | null>;
  captureFromCamera(): Promise<ScanResult | null>;
}

class ScannerServiceImpl implements ScannerService {
  async pickFromGallery(): Promise<ScanResult | null> {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      throw new Error('Permission to access the gallery is required to select documents.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: IMAGE_QUALITY,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        filename: asset.fileName || asset.uri.split('/').pop() || 'document.jpg'
      };
    }

    return null;
  }

  async captureFromCamera(): Promise<ScanResult | null> {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      throw new Error('Permission to access the camera is required to scan documents.');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: IMAGE_QUALITY,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        filename: asset.fileName || asset.uri.split('/').pop() || 'document.jpg'
      };
    }

    return null;
  }
}

export const scannerService = new ScannerServiceImpl();