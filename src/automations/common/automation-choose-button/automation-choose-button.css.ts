import { style } from '@vanilla-extract/css'

import { theme } from '~/common/theme'

export const root = style({})

export const label = style({
  color: theme.colors.textColorGrey,
  marginBottom: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

export const button = style({
  padding: '8px 16px',
  borderRadius: 8,
  border: `1px solid ${theme.colors.border}`,
  width: '100%',
  height: 64,
  gap: 8,
  position: 'relative',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  textAlign: 'left',
})

export const icon = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  margin: 'auto',
  right: 3,
  opacity: 0.64,
})
