import { cloneElement, useEffect } from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { useStore } from 'effector-react'

import { Button } from '~/common/button'
import { Head } from '~/common/head'
import { Paper } from '~/common/paper'
import { Typography } from '~/common/typography'
import { AppLayout } from '~/layouts'
import { paths } from '~/paths'
import welcomeInvest from '~/assets/images/welcome-invest.png'
import welcomeTrade from '~/assets/images/welcome-trade.png'
import { authModel } from '~/auth'
import { history } from '~/common/history'
import * as styles from './welcome.css'

export type WelcomeProps = unknown

const DATA = [
  {
    title: 'INVEST',
    img: welcomeInvest,
    text: "Find a pool to invest in, use auto compounding to boost your APY, protect your investment with 'stop-loss'",
    button: (
      <Button variant="outlined" as={ReactRouterLink} to={paths.invest.list}>
        start investing
      </Button>
    ),
  },
  {
    title: 'TRADE',
    img: welcomeTrade,
    text: "Use our 'Trailing Buy', or 'Stop-loss/Take-profit' features to trade like a pro on DEXs",
    button: (
      <Button variant="outlined" as={ReactRouterLink} to={paths.trade}>
        start trading
      </Button>
    ),
  },
]

export const Welcome: React.VFC<WelcomeProps> = () => {
  const userReady = useStore(authModel.$userReady)
  const user = useStore(authModel.$user)

  useEffect(() => {
    if (userReady && user) {
      history.replace(paths.portfolio)
    }
  }, [user, userReady])

  if (!userReady) return <></>

  return (
    <AppLayout title="Welcome to DeFiHelper">
      <Head title="Welcome" />
      <Typography variant="h3" className={styles.title}>
        Welcome to DeFiHelper — your powerfull investment tool
      </Typography>
      <div className={styles.grid}>
        {DATA.map((dataItem) => (
          <Paper key={dataItem.title} radius={8} className={styles.dataItem}>
            <Typography
              className={styles.dataItemTitle}
              transform="uppercase"
              variant="h4"
            >
              {dataItem.title}
            </Typography>
            <img alt="" src={dataItem.img} className={styles.dataItemImg} />
            <Typography
              className={styles.dataItemText}
              align="center"
              variant="body2"
            >
              {dataItem.text}
            </Typography>
            {cloneElement(dataItem.button, {
              ...dataItem.button.props,
              className: styles.dataItemButton,
            })}
          </Paper>
        ))}
      </div>
    </AppLayout>
  )
}
