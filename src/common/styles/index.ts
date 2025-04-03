/**
 * Theme Exports
 * 
 * This file exports all theme-related constants and utilities
 * for easy import throughout the application.
 */

import theme from "../constants/theme";

// Export theme constants
export { theme };

// Export theme utility functions
export const getColor = (colorPath: string) => {
  const paths = colorPath.split(".");
  let result: any = theme.colors;
  
  for (const path of paths) {
    if (result[path] === undefined) {
      return undefined;
    }
    result = result[path];
  }
  
  return result;
};

// Example usage:
// getColor("primary.main") => "#4caf50"
// getColor("secondary.teal") => "#26a69a"

export const spacing = theme.spacing;

// Utility function to generate CSS class names
export const classNames = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Export media query helpers
export const media = {
  up: (key: keyof typeof theme.breakpoints) => {
    const value = theme.breakpoints[key];
    return `@media (min-width: ${value}px)`;
  },
  down: (key: keyof typeof theme.breakpoints) => {
    const value = theme.breakpoints[key];
    return `@media (max-width: ${value - 0.02}px)`;
  },
  between: (
    start: keyof typeof theme.breakpoints,
    end: keyof typeof theme.breakpoints,
  ) => {
    const startValue = theme.breakpoints[start];
    const endValue = theme.breakpoints[end];
    return `@media (min-width: ${startValue}px) and (max-width: ${
      endValue - 0.02
    }px)`;
  },
}; 