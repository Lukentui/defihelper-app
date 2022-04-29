import { useStore, useGate } from 'effector-react'
import { useMemo } from 'react'
import { Paper } from '~/common/paper'
import { Typography } from '~/common/typography'
import { AppLayout } from '~/layouts'
import * as styles from './monitoring.css'
import { Chart } from '~/common/chart'
import { dateUtils } from '~/common/date-utils'
import { bignumberUtils } from '~/common/bignumber-utils'
import { useTheme } from '~/common/theme'
import * as model from './monitoring.model'
import { networksConfig } from '~/networks-config'

export const Monitoring: React.VFC = () => {
  const [themeMode] = useTheme()
  const usersRegisteringHistory = useStore(model.$usersRegisteringHistory)
  const automationsCreationHistory = useStore(model.$automationsCreationHistory)
  const automationsAutorestakeCreationHistory = useStore(
    model.$automationsAutorestakeCreationHistory
  )
  const automationsSuccessfulRunsHistory = useStore(
    model.$automationsSuccessfulRunsHistory
  )
  const automationsFailedRunsHistory = useStore(
    model.$automationsFailedRunsHistory
  )

  const dfhProfitsPerNetwork = useStore(model.$dfhEarningsHistory)

  useMemo(() => {
    Promise.all(
      Object.values(networksConfig).map((network) =>
        model.fetchDfhProtocolEarningsHistoryFx(network.chainId.toString())
      )
    )
  }, [])

  useGate(model.MonitoringGate)

  return (
    <AppLayout>
      <Typography variant="h3" className={styles.title}>
        Business metrics
      </Typography>
      <div className={styles.grid}>
        <Paper radius={8} className={styles.root}>
          <div className={styles.titleWrapper}>
            <Typography variant="h5" className={styles.title}>
              Users
            </Typography>

            <Typography variant="h5" className={styles.total}>
              {usersRegisteringHistory.pop()?.number ?? 0}
            </Typography>
          </div>

          <Chart
            dataFields={[
              {
                valueY: 'number',
                dateX: 'date',
                color: themeMode === 'dark' ? '#CCFF3C' : '#39C077',
              },
            ]}
            data={usersRegisteringHistory.map((point) => ({
              date: dateUtils.toDate(point.date),
              number: bignumberUtils.floor(point.number),
              format: bignumberUtils.format(point.number),
            }))}
            tooltipText="{format}"
            id="users_metric"
            loading={false}
          />
        </Paper>

        <Paper radius={8} className={styles.root}>
          <div className={styles.titleWrapper}>
            <Typography variant="h5" className={styles.title}>
              Automates
            </Typography>

            <Typography variant="h5" className={styles.total}>
              {automationsCreationHistory.pop()?.number ?? 0}
            </Typography>
          </div>

          <Chart
            dataFields={[
              {
                valueY: 'number',
                dateX: 'date',
                color: themeMode === 'dark' ? '#CCFF3C' : '#39C077',
              },
            ]}
            data={automationsCreationHistory.map((point) => ({
              date: dateUtils.toDate(point.date),
              number: bignumberUtils.floor(point.number),
              format: bignumberUtils.format(point.number),
            }))}
            tooltipText="{format}"
            id="automates_metric"
            loading={false}
          />
        </Paper>

        <Paper radius={8} className={styles.root}>
          <div className={styles.titleWrapper}>
            <Typography variant="h5" className={styles.title}>
              Autostaking automates
            </Typography>

            <Typography variant="h5" className={styles.total}>
              {automationsAutorestakeCreationHistory.pop()?.number ?? 0}
            </Typography>
          </div>

          <Chart
            dataFields={[
              {
                valueY: 'number',
                dateX: 'date',
                color: themeMode === 'dark' ? '#CCFF3C' : '#39C077',
              },
            ]}
            data={automationsAutorestakeCreationHistory.map((point) => ({
              date: dateUtils.toDate(point.date),
              number: bignumberUtils.floor(point.number),
              format: bignumberUtils.format(point.number),
            }))}
            tooltipText="{format}"
            id="autostaking_automates_metric"
            loading={false}
          />
        </Paper>

        <Paper radius={8} className={styles.root}>
          <div className={styles.titleWrapper}>
            <Typography variant="h5" className={styles.title}>
              Successful automations runs
            </Typography>

            <Typography variant="h5" className={styles.total}>
              {automationsSuccessfulRunsHistory.pop()?.number ?? 0}
            </Typography>
          </div>

          <Chart
            dataFields={[
              {
                valueY: 'number',
                dateX: 'date',
                color: themeMode === 'dark' ? '#CCFF3C' : '#39C077',
              },
            ]}
            data={automationsSuccessfulRunsHistory.map((point) => ({
              date: dateUtils.toDate(point.date),
              number: bignumberUtils.floor(point.number),
              format: bignumberUtils.format(point.number),
            }))}
            tooltipText="{format}"
            id="completed_automations_metric"
            loading={false}
          />
        </Paper>

        <Paper radius={8} className={styles.root}>
          <div className={styles.titleWrapper}>
            <Typography variant="h5" className={styles.title}>
              Failed automations runs
            </Typography>

            <Typography variant="h5" className={styles.total}>
              {automationsFailedRunsHistory.pop()?.number ?? 0}
            </Typography>
          </div>

          <Chart
            dataFields={[
              {
                valueY: 'number',
                dateX: 'date',
                color: themeMode === 'dark' ? '#CCFF3C' : '#39C077',
              },
            ]}
            data={automationsFailedRunsHistory.map((point) => ({
              date: dateUtils.toDate(point.date),
              number: bignumberUtils.floor(point.number),
              format: bignumberUtils.format(point.number),
            }))}
            tooltipText="{format}"
            id="failed_automations_metric"
            loading={false}
          />
        </Paper>

        {Object.keys(dfhProfitsPerNetwork).map((network) =>
          dfhProfitsPerNetwork[network].length ? (
            <Paper radius={8} className={styles.root}>
              <div className={styles.titleWrapper}>
                <Typography variant="h5" className={styles.title}>
                  {networksConfig[network].title} - comissions earned
                </Typography>

                <Typography variant="h5" className={styles.total}>
                  {dfhProfitsPerNetwork[network].pop()?.number ?? 0}
                </Typography>
              </div>

              <Chart
                dataFields={[
                  {
                    valueY: 'number',
                    dateX: 'date',
                    color: themeMode === 'dark' ? '#CCFF3C' : '#39C077',
                  },
                ]}
                data={dfhProfitsPerNetwork[network].map((point) => ({
                  date: dateUtils.toDate(point.date),
                  number: bignumberUtils.floor(point.number),
                  format: bignumberUtils.format(point.number),
                }))}
                tooltipText="{format}"
                id={`dfh_profits_${network}`}
                loading={false}
              />
            </Paper>
          ) : null
        )}
      </div>
    </AppLayout>
  )
}
