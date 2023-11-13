declare module '@mui/material/styles/createPalette' {
  interface Palette {
    easy: PaletteColor;
    medium: PaletteColor;
    hard: PaletteColor;
  }
}

const palette = {
  primary: {
    main: '#2F4858',
  },
  secondary: {
    main: '#1976D2',
  },
  success: {
    main: '#2BA555',
  },
  warning: {
    main: '#FAB931',
  },
  error: {
    main: '#FF2C55',
  },
  easy: {
    main: '#2BA555',
    light: '#79EB95',
    dark: '#00661B',
    contrastText: '#FFFFFF',
  },
  medium: {
    main: '#FAB931',
    light: '#FBCE70',
    dark: '#C98F00',
    contrastText: '#FFFFFF',
  },
  hard: {
    main: '#FF2C55',
    light: '#FF4A68',
    dark: '#B60024',
    contrastText: '#FFFFFF',
  },
};

export default palette;

export type PaletteKey = keyof typeof palette;
