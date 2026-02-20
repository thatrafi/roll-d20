import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#111814',
  backgroundDarker: '#0f1612',
  surface: '#1c2721',
  surfaceHighlight: '#25332b',
  primary: '#13ec80',
  primaryDark: '#10d673',
  text: '#ffffff',
  textDim: 'rgba(255, 255, 255, 0.5)',
  textSlate: '#94a3b8',
  border: 'rgba(255, 255, 255, 0.05)',
  danger: '#ef4444',
  white: '#ffffff',
  black: '#000000',
};

export const COMMON_STYLES = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  }
});
