import { useMemo } from 'react'
import clsx from 'clsx'
import { useGate, useStore } from 'effector-react'
import LazyLoad from 'react-lazyload'

import { AppLayout } from '~/layouts'
import { PortfolioEarnings } from '~/portfolio/portfolio-earnings'
import { PortfolioTotalWorth } from './portfolio-total-worth'
import { PortfolioCoinBalance } from './portfolio-coin-balance'
import { Head } from '~/common/head'
import { Typography } from '~/common/typography'
import { PortfolioMetricCards } from './portfolio-metric-cards'
import { PortfolioWallets } from './portfolio-wallets/portfolio-wallets'
import { PortfolioAssets } from './portfolio-assets'
import {
  useOnTokenMetricUpdatedSubscription,
  useOnWalletMetricUpdatedSubscription,
} from './common'
import { PortfolioDeployedContracts } from './portfolio-deployed-contracts'
import { SettingsContacts } from '~/settings/settings-contacts'
import { settingsWalletModel } from '~/settings/settings-wallets'
import { Loader } from '~/common/loader'
import { authModel } from '~/auth'
import * as styles from './portfolio.css'
import * as model from './portfolio.model'
import { PortfolioExchanges } from '~/portfolio/portfolio-exchanges'
import { useOnWalletCreatedSubscription } from '~/settings/common'

export type PortfolioProps = unknown

const HEIGHT = 300

export const Portfolio: React.VFC<PortfolioProps> = () => {
  const portfolioCollected = useStore(model.$portfolioCollected)
  const loading = useStore(model.fetchPortfolioCollectedFx.pending)

  const user = useStore(authModel.$user)

  useGate(model.PortfolioGate)

  const variables = useMemo(() => {
    if (!user) return undefined

    return {
      user: [user.id],
    }
  }, [user])

  useOnTokenMetricUpdatedSubscription(({ data }) => {
    if (data?.onTokenMetricUpdated.id) {
      model.portfolioUpdated()
      settingsWalletModel.updated()
    }
  }, variables)
  useOnWalletMetricUpdatedSubscription(({ data }) => {
    if (data?.onWalletMetricUpdated.id) {
      model.portfolioUpdated()
      settingsWalletModel.updated()
    }
  }, variables)
  useOnWalletCreatedSubscription(({ data }) => {
    if (data?.onWalletCreated.id) {
      model.portfolioUpdated()
      settingsWalletModel.updated()
    }
  }, variables)

  return (
    <AppLayout title="Portfolio">
      <Head title="Portfolio" />
      {loading && !portfolioCollected && (
        <div className={styles.loader}>
          <Loader height="36" />
        </div>
      )}

      {portfolioCollected && (
        <>
          <Typography variant="h3" className={styles.title}>
            Portfolio
          </Typography>
          <LazyLoad height={HEIGHT}>
            <PortfolioMetricCards className={styles.cards} />
          </LazyLoad>
          <div className={clsx(styles.grid, styles.section)}>
            <LazyLoad height={HEIGHT} className={styles.mainChart}>
              <PortfolioTotalWorth />
            </LazyLoad>
            <LazyLoad height={HEIGHT}>
              <PortfolioEarnings />
            </LazyLoad>
            <LazyLoad height={HEIGHT}>
              <PortfolioCoinBalance />
            </LazyLoad>
          </div>
          <LazyLoad height={HEIGHT} className={styles.section}>
            <PortfolioAssets />
          </LazyLoad>
          <LazyLoad height={HEIGHT} className={styles.section}>
            <PortfolioWallets />
          </LazyLoad>
          <LazyLoad height={HEIGHT} className={styles.section}>
            <PortfolioDeployedContracts />
          </LazyLoad>
          <LazyLoad height={HEIGHT}>
            <PortfolioExchanges />
          </LazyLoad>
        </>
      )}
      {!loading && !portfolioCollected && (
        <>
          <Typography variant="h3" className={styles.title}>
            Portfolio
          </Typography>
          <Typography
            variant="h3"
            family="mono"
            transform="uppercase"
            className={styles.generatingTitle}
          >
            Generating Portfolio...
          </Typography>
          <Typography className={styles.generatingDescription}>
            The building process can take up to 24 hours. Add contacts so you
            can recieve notifications about any actions. You will be notified
            when portfolio is ready. You will be able to change it any time in
            settings.
          </Typography>
          <LazyLoad height={HEIGHT}>
            <SettingsContacts withHeader={false} />
          </LazyLoad>
        </>
      )}
    </AppLayout>
  )
}
