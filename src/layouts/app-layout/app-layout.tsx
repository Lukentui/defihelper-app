import { paths } from '~/paths'
import { WalletNetworkSwitcher } from '~/wallets/wallet-network-switcher'
import { LayoutSidebar, LayoutContainer } from '../common'
import * as styles from './app-layout.css'

export type AppLayoutProps = unknown

const MENU = [
  {
    title: 'Profile',
    path: paths.portfolio as string,
    icon: 'home' as const,
  },
  {
    title: 'Protocols',
    path: paths.protocols.list as string,
    icon: 'grid' as const,
  },
  {
    title: 'Automations',
    path: paths.automations.list,
    icon: 'energy' as const,
  },
  {
    title: 'Notifications',
    path: paths.userEventSubscriptions.list as string,
    icon: 'notification' as const,
  },
  {
    title: 'Roadmap',
    path: paths.proposals.list as string,
    icon: 'check' as const,
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: 'settings' as const,
  },
]

export const AppLayout: React.FC<AppLayoutProps> = (props) => {
  return (
    <div className={styles.root}>
      <LayoutSidebar menu={MENU}>
        <WalletNetworkSwitcher />
      </LayoutSidebar>
      <LayoutContainer>{props.children}</LayoutContainer>
    </div>
  )
}
