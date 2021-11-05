import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'

import { Button } from '~/common/button'
import { useDialog } from '~/common/dialog'
import { Input } from '~/common/input'
import { UserContactFragmentFragment } from '~/graphql/_generated-types'
import { AutomationForm } from '../automation-form'
import { AutomationContactsDialog } from '../automation-contacts-dialog'
import { AutomationChooseButton } from '../automation-choose-button'
import { Icon } from '~/common/icon'
import * as styles from './automation-action-notification.css'

type FormValues = {
  contact: UserContactFragmentFragment
  message: string
}

export type AutomationActionNotificationProps = {
  onSubmit: (formValues: string) => void
  defaultValues?: Omit<FormValues, 'contact'> & { contactId: string }
  contacts: UserContactFragmentFragment[]
}

export const AutomationActionNotification: React.VFC<AutomationActionNotificationProps> =
  (props) => {
    const { handleSubmit, register, formState, control, setValue, reset } =
      useForm<FormValues>()

    const [openContactDialog] = useDialog(AutomationContactsDialog)

    const handleAddContact = async () => {
      try {
        const contact = await openContactDialog({
          contacts: props.contacts,
        })

        setValue('contact', contact)
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message)
        }
      }
    }

    useEffect(() => {
      const contact = props.contacts.find(
        ({ id }) => id === props.defaultValues?.contactId
      )

      if (contact) {
        reset({
          contact,
          message: props.defaultValues?.message,
        })
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.defaultValues, props.contacts])

    return (
      <AutomationForm
        onSubmit={handleSubmit(({ contact, message }) =>
          props.onSubmit(
            JSON.stringify({
              message,
              contactId: contact?.id,
            })
          )
        )}
      >
        <Controller
          render={({ field }) => (
            <AutomationChooseButton
              onClick={handleAddContact}
              label="contact"
              className={styles.input}
            >
              {field.value && (
                <>
                  <Icon icon={field.value.broker} width="24" height="24" />
                  {field.value?.name.length
                    ? field.value?.name
                    : field.value?.address || 'Untitled'}
                </>
              )}
              {!field.value && 'Choose contact'}
            </AutomationChooseButton>
          )}
          name="contact"
          control={control}
        />
        <Input
          label="Message"
          {...register('message', { required: true })}
          error={Boolean(formState.errors.message?.message)}
          helperText={formState.errors.message?.message}
          defaultValue={props.defaultValues?.message}
          className={styles.input}
        />
        <Button type="submit">Submit</Button>
      </AutomationForm>
    )
  }
