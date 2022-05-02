import { useGate, useStore } from 'effector-react'

import { Typography } from '~/common/typography'
import {
  SettingsHeader,
  SettingsContactFormDialog,
  SettingsContactCard,
  SettingsPaper,
  SettingsConfirmDialog,
  SettingsSuccessDialog,
  SettingsGrid,
} from '~/settings/common'
import { useDialog } from '~/common/dialog'
import { authModel } from '~/auth'
import * as model from './settings-contact.model'
import * as styles from './settings-contacts.css'
import { UserContactBrokerEnum } from '~/api/_generated-types'

export type SettingsContactsProps = {
  className?: string
  withHeader?: boolean
}

export const SettingsContacts: React.VFC<SettingsContactsProps> = (props) => {
  const [openContactForm] = useDialog(SettingsContactFormDialog)
  const [openConfirm] = useDialog(SettingsConfirmDialog)
  const [openSuccess] = useDialog(SettingsSuccessDialog)

  const user = useStore(authModel.$user)

  const contactList = useStore(model.$userContactList)
  const contactCreating = useStore(model.createUserContactFx.pending)
  const creatingParams = useStore(model.$creatingUserParams)

  useGate(model.SettingsContactsGate)

  const { withHeader = true } = props

  const handleOpenContactForm = (broker: UserContactBrokerEnum) => async () => {
    try {
      if (!user) return

      if (broker === UserContactBrokerEnum.Telegram) {
        const data = await model.createUserContactFx({
          address: '',
          broker,
          name: 'telegram',
        })

        await openSuccess({
          type: broker,
          confirmationCode: data.confirmationCode,
        })
      } else {
        const result = await openContactForm({
          defaultValues: {
            broker,
          },
        })

        const data = await model.createUserContactFx({
          ...result,
          broker,
          name: result.address ?? 'telegram',
        })

        await openSuccess({
          type: broker,
          confirmationCode: data.confirmationCode,
        })
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  const handleDeleteContact =
    (contact: typeof contactList[number]) => async () => {
      try {
        await openConfirm({ name: contact.name })

        model.deleteUserContactFx(contact.id)
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
        }
      }
    }

  const contactsMap = contactList.reduce((acc, contact) => {
    acc.set(contact.broker, contact)

    return acc
  }, new Map<UserContactBrokerEnum, typeof contactList[number]>())

  const telegram = contactsMap.get(UserContactBrokerEnum.Telegram)
  const email = contactsMap.get(UserContactBrokerEnum.Email)

  return (
    <div className={props.className}>
      {withHeader && (
        <SettingsHeader className={styles.header}>
          <Typography variant="h3">Contacts</Typography>
        </SettingsHeader>
      )}
      <SettingsGrid>
        <SettingsContactCard
          address={telegram?.address}
          title="Telegram"
          type={UserContactBrokerEnum.Telegram}
          loading={
            telegram?.editing ||
            telegram?.deleting ||
            (contactCreating &&
              creatingParams?.broker === UserContactBrokerEnum.Telegram)
          }
          status={telegram?.status}
          onConnect={handleOpenContactForm(UserContactBrokerEnum.Telegram)}
          onDisconnect={telegram ? handleDeleteContact(telegram) : undefined}
        />
        <SettingsContactCard
          address={email?.address}
          title="Email"
          type={UserContactBrokerEnum.Email}
          loading={
            email?.editing ||
            email?.deleting ||
            (contactCreating &&
              creatingParams?.broker === UserContactBrokerEnum.Email)
          }
          status={email?.status}
          onConnect={handleOpenContactForm(UserContactBrokerEnum.Email)}
          onDisconnect={email ? handleDeleteContact(email) : undefined}
        />
        <SettingsPaper />
      </SettingsGrid>
    </div>
  )
}
