import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Input } from '~/common/input'
import { Link } from '~/common/link'
import { settingsIntegrationBinanceSchema } from './settings-integration-binance-form.validation'
import * as styles from './settings-integration-binance-form.css'

type FormValues = {
  apiKey: string
  secret: string
}

export type SettingsIntegrationDialogProps = {
  onConfirm: (formValues: FormValues) => void
  defaultValues?: FormValues
  className?: string
}

const HOW_TO_CREATE_API = 'https://www.binance.com/en/support/faq/360002502072'

export const SettingsIntegrationBinanceForm: React.VFC<SettingsIntegrationDialogProps> =
  (props) => {
    const { register, handleSubmit, formState } = useForm<FormValues>({
      defaultValues: props.defaultValues,
      resolver: yupResolver(settingsIntegrationBinanceSchema),
    })

    return (
      <form
        noValidate
        onSubmit={handleSubmit(props.onConfirm)}
        className={clsx(styles.form, props.className)}
      >
        <Input
          {...register('apiKey')}
          className={styles.input}
          placeholder="API Key"
          defaultValue={props.defaultValues?.apiKey}
          helperText={formState.errors.apiKey?.message}
          error={Boolean(formState.errors.apiKey?.message)}
          label={
            <Link
              href={HOW_TO_CREATE_API}
              target="_blank"
              className={styles.createApiInstructionLink}
            >
              How to create API key
            </Link>
          }
        />
        <Input
          {...register('secret')}
          className={styles.input}
          placeholder="Secret key"
          defaultValue={props.defaultValues?.secret}
          helperText={formState.errors.secret?.message}
          error={Boolean(formState.errors.secret?.message)}
        />
      </form>
    )
  }
