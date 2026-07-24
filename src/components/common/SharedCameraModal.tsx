import React, { useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { ANIMATION } from "../../constants/Animation";
import { IMAGE_QUALITY } from "../../constants/App";
import { colors, radius, spacing, typography } from "../../theme";
import { mediumImpact } from "../../utils/haptics";

interface SharedCameraModalProps {
  visible: boolean;
  cameraFacing: "front" | "back";
  onClose: () => void;
  onCapture: (uri: string, filename: string) => void;
}

export function SharedCameraModal({
  visible,
  cameraFacing,
  onClose,
  onCapture,
}: SharedCameraModalProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [guideTop, setGuideTop] = useState(0);
  const flashAnim = useRef(new Animated.Value(0)).current;

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    mediumImpact();
    setIsCapturing(true);

    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: ANIMATION.FLASH_IN_MS || 50,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: ANIMATION.FLASH_OUT_MS || 400,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const photoData = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      if (photoData && photoData.uri) {
        if (cameraFacing === "front") {
          // Original complex crop math for perfect 1:1 Guided Selfie
          let photoWidth = photoData.width;
          let photoHeight = photoData.height;

          if (screenWidth < screenHeight && photoWidth > photoHeight) {
            photoWidth = photoData.height;
            photoHeight = photoData.width;
          }

          const scale = Math.max(
            screenWidth / photoWidth,
            screenHeight / photoHeight,
          );
          const displayedWidth = photoWidth * scale;
          const displayedHeight = photoHeight * scale;

          const offsetX = (displayedWidth - screenWidth) / 2;
          const offsetY = (displayedHeight - screenHeight) / 2;
          const guideLeft = (screenWidth - 280) / 2;

          const guideCenterX = guideLeft + 280 / 2;
          const guideCenterY = guideTop + 280 / 2;

          const squareSize = 280;
          const halfSquare = squareSize / 2;

          const squareLeft = guideCenterX - halfSquare;
          const squareTop = guideCenterY - halfSquare;

          const cropX = Math.max(0, Math.floor((squareLeft + offsetX) / scale));
          const cropY = Math.max(0, Math.floor((squareTop + offsetY) / scale));

          const targetCropSize = Math.floor(squareSize / scale);
          const cropSize = Math.min(
            targetCropSize,
            photoData.width - cropX,
            photoData.height - cropY,
          );

          const image = await ImageManipulator.manipulate(photoData.uri)
            .crop({
              originX: cropX,
              originY: cropY,
              width: cropSize,
              height: cropSize,
            })
            .renderAsync();

          const manipResult = await image.saveAsync({
            compress: IMAGE_QUALITY,
            format: SaveFormat.JPEG,
          });
          const filename = manipResult.uri.split("/").pop() || "selfie.jpg";
          onCapture(manipResult.uri, filename);
        } else {
          // Rear Camera Document Capture (No 1:1 forced crop)
          const image = await ImageManipulator.manipulate(
            photoData.uri,
          ).renderAsync();
          const manipResult = await image.saveAsync({
            compress: IMAGE_QUALITY,
            format: SaveFormat.JPEG,
          });
          const filename = manipResult.uri.split("/").pop() || "document.jpg";
          onCapture(manipResult.uri, filename);
        }
      }
    } catch (error) {
      console.error("Failed to capture photo:", error);
    } finally {
      setIsCapturing(false);
    }
  };

  if (!visible) return null;

  if (!permission) {
    return <View style={styles.permissionContent} />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionSub}>
            We need access to your camera to capture photos.
          </Text>
          <Pressable style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Allow Camera Access</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
            <Text style={[styles.btnText, styles.cancelText]}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <SafeAreaView style={styles.cameraContainer}>
        {/* Explicitly passing the requested facing mode */}
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing={cameraFacing}
        />

        <View style={styles.cameraOverlay} pointerEvents="box-none">
          <View
            style={styles.guideContainer}
            onLayout={(e) => {
              const { y, height } = e.nativeEvent.layout;
              setGuideTop(y + (height - 280) / 2);
            }}
          >
            {cameraFacing === "front" ? (
              <View style={styles.faceGuide} />
            ) : (
              <View style={styles.documentGuide} />
            )}
          </View>

          <View style={styles.cameraFooter}>
            <Pressable
              style={({ pressed }) => [
                styles.shutterButton,
                pressed && styles.shutterButtonPressed,
                isCapturing && styles.shutterButtonDisabled,
              ]}
              onPress={handleCapture}
              disabled={isCapturing}
            >
              <View style={styles.shutterInner} />
            </Pressable>
          </View>
        </View>

        <Animated.View
          style={[styles.flashOverlay, { opacity: flashAnim }]}
          pointerEvents="none"
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
  },
  permissionIcon: { fontSize: 64, marginBottom: spacing.lg },
  permissionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  permissionSub: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    width: "100%",
    alignItems: "center",
  },
  btnText: {
    color: "#FFF",
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
  cancelBtn: {
    backgroundColor: "transparent",
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: { color: colors.textSecondary },
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    zIndex: 10,
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  closeButton: { padding: spacing.xs, width: 60 },
  closeText: {
    color: "#FFF",
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
  },
  headerTextContainer: { alignItems: "center", flex: 1 },
  cameraTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: "#FFF",
    marginBottom: spacing.xs,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cameraSubtitle: {
    fontSize: typography.fontSize.sm,
    color: "rgba(255,255,255,0.9)",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  guideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  faceGuide: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderStyle: "dashed",
  },
  documentGuide: {
    width: "85%",
    height: "60%",
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderStyle: "dashed",
  },
  cameraFooter: {
    paddingBottom: 60,
    paddingTop: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterButtonPressed: { opacity: 0.7, transform: [{ scale: 0.95 }] },
  shutterButtonDisabled: { opacity: 0.5 },
  shutterInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFF",
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFF",
    zIndex: 100,
  },
});