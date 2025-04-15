export interface ThemeColorProps {
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--popover': string;
  '--popover-foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--border': string;
  '--input': string;
  '--ring': string;
  '--radius'?: string;
}

export interface ThemeColors {
  light: ThemeColorProps;
  dark: ThemeColorProps;
}

export interface ColorPalette {
  key: string;
  label: string;
  value: ThemeColors;
}

export interface MainThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ModeColors {
  light: MainThemeColors;
  dark: MainThemeColors;
}
