import { createGlobalStyle } from 'styled-components'

export type ThemeName = 'dark' | 'light'

export interface ThemeColors {
  background: {
    page: string
    surface: string
    surfaceMuted: string
    surfaceElevated: string
    overlay: string
    imageScrim: string
  }
  text: {
    primary: string
    secondary: string
    muted: string
    inverse: string
    disabled: string
    link: string
  }
  border: {
    subtle: string
    default: string
    strong: string
    focus: string
  }
  action: {
    primary: string
    primaryHover: string
    primaryActive: string
    primaryText: string
    secondary: string
    secondaryText: string
    secondaryHover: string
    secondaryActive: string
    disabled: string
    disabledText: string
  }
  feedback: {
    success: string
    successMuted: string
    warning: string
    warningMuted: string
    danger: string
    dangerMuted: string
    info: string
    infoMuted: string
  }
  game: {
    gold: string
    reputationUp: string
    reputationDown: string
    guestHappy: string
    guestNeutral: string
    guestUnhappy: string
    tableReady: string
    tableWorn: string
    tableBroken: string
    tableBrokenFill: string
    staff: string
    queue: string
    canvasLine: string
  }
}

export interface AppTheme {
  name: ThemeName
  colors: ThemeColors
}

export const darkTheme: AppTheme = {
  name: 'dark',
  colors: {
    background: {
      page: '#151514',
      surface: '#20201e',
      surfaceMuted: '#292927',
      surfaceElevated: '#31312f',
      overlay: 'rgba(0, 0, 0, 0.64)',
      imageScrim:
        'linear-gradient(rgba(18, 17, 15, 0.55), rgba(18, 17, 15, 0.82))',
    },
    text: {
      primary: '#f1ede5',
      secondary: '#aaa297',
      muted: '#817b72',
      inverse: '#1c1b19',
      disabled: '#68635c',
      link: '#a997f2',
    },
    border: {
      subtle: '#353532',
      default: '#50504b',
      strong: '#77736b',
      focus: '#d89a45',
    },
    action: {
      primary: '#6e57c8',
      primaryHover: '#806bdd',
      primaryActive: '#5843ad',
      primaryText: '#ffffff',
      secondary: '#292927',
      secondaryText: '#f1ede5',
      secondaryHover: '#353532',
      secondaryActive: '#20201e',
      disabled: '#3a3936',
      disabledText: '#777169',
    },
    feedback: {
      success: '#91c84a',
      successMuted: '#26351f',
      warning: '#d89a45',
      warningMuted: '#3d2e1d',
      danger: '#ef8d91',
      dangerMuted: '#4a2022',
      info: '#7ba7e8',
      infoMuted: '#202f44',
    },
    game: {
      gold: '#d89a45',
      reputationUp: '#91c84a',
      reputationDown: '#ef8d91',
      guestHappy: '#91c84a',
      guestNeutral: '#aaa7a0',
      guestUnhappy: '#ef8d91',
      tableReady: '#c4c0b7',
      tableWorn: '#8a847a',
      tableBroken: '#ef8d91',
      tableBrokenFill: '#5a1719',
      staff: '#6e57c8',
      queue: '#d89a45',
      canvasLine: '#5a5954',
    },
  },
}

export const lightTheme: AppTheme = {
  name: 'light',
  colors: {
    background: {
      page: '#f4f1ea',
      surface: '#ffffff',
      surfaceMuted: '#eeece6',
      surfaceElevated: '#f8f7f3',
      overlay: 'rgba(28, 27, 25, 0.4)',
      imageScrim:
        'radial-gradient(120% 90% at 50% 45%, rgba(244, 241, 234, 0.84), rgba(244, 241, 234, 0.52) 55%, rgba(244, 241, 234, 0.34))',
    },
    text: {
      primary: '#24221f',
      secondary: '#625d55',
      muted: '#8b857c',
      inverse: '#f7f4ed',
      disabled: '#aaa49a',
      link: '#5843ad',
    },
    border: {
      subtle: '#e1ddd4',
      default: '#c5c0b6',
      strong: '#8d887f',
      focus: '#a96714',
    },
    action: {
      primary: '#5e49b8',
      primaryHover: '#4f3d9f',
      primaryActive: '#402f87',
      primaryText: '#ffffff',
      secondary: '#eeece6',
      secondaryText: '#24221f',
      secondaryHover: '#e1ddd4',
      secondaryActive: '#d3cec3',
      disabled: '#dedad1',
      disabledText: '#989187',
    },
    feedback: {
      success: '#5c931e',
      successMuted: '#e7f2d9',
      warning: '#a96714',
      warningMuted: '#f8ead3',
      danger: '#c4363b',
      dangerMuted: '#fbe2e3',
      info: '#356fb7',
      infoMuted: '#e1ecfa',
    },
    game: {
      gold: '#b87519',
      reputationUp: '#5c931e',
      reputationDown: '#c4363b',
      guestHappy: '#5c931e',
      guestNeutral: '#8d887f',
      guestUnhappy: '#df474b',
      tableReady: '#ffffff',
      tableWorn: '#d0cbc1',
      tableBroken: '#b52f33',
      tableBrokenFill: '#fbe2e3',
      staff: '#5e49b8',
      queue: '#b87519',
      canvasLine: '#b8b3a9',
    },
  },
}

export const themes: Record<ThemeName, AppTheme> = {
  dark: darkTheme,
  light: lightTheme,
}

export const theme = darkTheme

export const GlobalStyle = createGlobalStyle`
  body {
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.page};
  }
`
