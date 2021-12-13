import { style } from '@vanilla-extract/css'

import { theme } from '~/common/theme'

export const root = style({})

export const header = style({
  marginBottom: 40,
  display: 'none',
  gap: 24,

  '@media': {
    [theme.mediaQueries.md()]: {
      display: 'flex',
    },
  },
})

export const title = style({
  display: 'flex',
  alignItems: 'center',
})

export const grid = style({
  display: 'grid',
  gap: 24,

  '@media': {
    [theme.mediaQueries.md()]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(352px, 1fr))',
    },
  },

  selectors: {
    '&:not(:last-child)': {
      marginBottom: 120,
    },
  },
})

export const countDesktop = style({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '0 12px',
})

export const countMobile = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  padding: 4,
})

export const countTitle = style({
  fontSize: 12,
  lineHeight: '16px',
})

export const searchDesktop = style({
  maxWidth: 211,
})

export const action = style({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
})

export const searchButton = style({
  backgroundColor: theme.colors.paper,
  padding: 4,
  borderRadius: 6,
})

export const addAutomations = style({
  width: 24,
  height: 24,
  padding: 0,
})

export const left = style({
  display: 'none',
  marginLeft: 6,

  '@media': {
    [theme.mediaQueries.lg()]: {
      display: 'inline',
    },
  },
})

export const loader = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 32px',
  minHeight: 420,
})

export const loaderIcon = style({
  width: 94,
  height: 52,
  margin: 'auto',
})
