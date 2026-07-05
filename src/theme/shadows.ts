import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';

type Shadows = Record<'sm' | 'md' | 'lg', ViewStyle>;

export const shadows: Shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
    },
    android: {
      elevation: 8,
    },
    default: {},
  }),
};