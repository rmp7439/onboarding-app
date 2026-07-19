import * as Haptics from 'expo-haptics';

export const lightImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const mediumImpact = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};

export const success = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const warning = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
};

export const error = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};