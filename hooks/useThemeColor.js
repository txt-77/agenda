import { useColorScheme } from 'react-native';

export function useThemeColor() {
  const theme = useColorScheme(); // 'light' | 'dark'

  const colors = theme === 'dark'
    ? {
        background: '#000000',
        text: '#ffffff',
        card: '#121212',
        input: '#1E1E1E',
        border: '#2A2A2A',
        primary: '#0ea5e9'
      }
    : {
        background: '#ffffff',
        text: '#000000',
        card: '#f2f2f2',
        input: '#ffffff',
        border: '#cccccc',
        primary: '#0077cc'
      };

  return { theme, colors };
}
