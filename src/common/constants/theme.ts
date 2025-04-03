/**
 * Modern Green Theme Configuration
 * 
 * A stylish green palette with supporting colors for a fresh, modern look
 * that will impress clients and provide a professional appearance.
 */

export const theme = {
  colors: {
    // Primary Green Palette
    primary: {
      lightest: '#e6f7e9',
      lighter: '#c2e9c9',
      light: '#8ed69a',
      main: '#4caf50',  // Main brand green
      dark: '#3b8c3d',
      darker: '#2a682b',
      darkest: '#1a411a',
    },
    
    // Secondary Accent Colors
    secondary: {
      teal: '#26a69a',     // Teal accent for CTAs and highlights
      blue: '#42a5f5',     // Blue for links and information
      amber: '#ffb300',    // Amber for warnings and important notices
      purple: '#7e57c2',   // Purple for premium features
    },
    
    // Grey Scale
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    
    // Semantic Colors
    semantic: {
      success: '#4caf50',
      info: '#2196f3',
      warning: '#ff9800',
      error: '#f44336',
    },
    
    // Text Colors
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9e9e9e',
      hint: '#9e9e9e',
    },
    
    // Background Colors
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
      dark: '#f0f2f5',
    },
    
    // Common Colors
    common: {
      white: '#ffffff',
      black: '#000000',
    },
  },
  
  // Typography
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  
  // Spacing
  spacing: (factor: number) => `${factor * 8}px`,
  
  // Breakpoints
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.12)',
    lg: '0 8px 16px rgba(0,0,0,0.14)',
    xl: '0 12px 24px rgba(0,0,0,0.16)',
  },
  
  // Border Radius
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
};

export default theme; 