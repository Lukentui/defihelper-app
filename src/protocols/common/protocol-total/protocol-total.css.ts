import { createVar, style } from '@vanilla-extract/css'

import { theme } from '~/common/theme'

const width = createVar()

export const total = style({
  display: 'grid',
  gap: 16,

  '@media': {
    [theme.mediaQueries.md()]: {
      gridTemplateColumns: `repeat(auto-fit, minmax(${width}, 1fr))`,
      gap: 24,
    },

    [theme.mediaQueries.up(1071)]: {
      vars: {
        [width]: '250px',
      },
    },

    [theme.mediaQueries.lg()]: {
      vars: {
        [width]: '300px',
      },
    },
  },
})

export const totalTitle = style({
  color: theme.colors.textColorGrey,
  marginBottom: 4,
})

export const totalItem = style({
  padding: '24px 32px 32px',
})

export const link = style({
  color: theme.colors.textColorGreen,
})
