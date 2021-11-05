import { Event } from 'effector'
import { useGate, useStore } from 'effector-react'
import omit from 'lodash.omit'

import {
  Action,
  Condition,
  isAction,
  isCondition,
  Trigger,
} from '../common/automation.types'
import { Dialog, useDialog } from '~/common/dialog'
import {
  AutomateActionCreateInputType,
  AutomateActionUpdateInputType,
  AutomateConditionCreateInputType,
  AutomationContractFragmentFragment,
} from '~/graphql/_generated-types'
import { Button } from '~/common/button'
import { AutomationTriggerExpression } from '../common/automation-trigger-expression'
import { AutomationDeployContract } from '../automation-deploy-contract'
import { Tab, TabPanel, Tabs } from '~/common/tabs'
import * as model from './automation-update.model'
import * as contactModel from '~/settings/settings-contacts/settings-contact.model'
import * as styles from './automation-update.css'

export type AutomationUpdateProps = {
  onConfirm: () => void
  onCancel: () => void
  trigger?: Trigger
  contracts: AutomationContractFragmentFragment[]
  onAddContract: Event<AutomationContractFragmentFragment>
}

export const AutomationUpdate: React.VFC<AutomationUpdateProps> = (props) => {
  const actions = useStore(model.$actions)
  const conditions = useStore(model.$conditions)

  const conditionsCount = useStore(model.$conditionsCount)
  const actionsCount = useStore(model.$actionsCount)

  const contacts = useStore(contactModel.$userContactList)

  const [openDeploy] = useDialog(AutomationDeployContract)

  useGate(model.AutomationUpdateGate, props.trigger)
  useGate(contactModel.SettingsContactsGate)

  const handleAddAction = () => {
    model.setAction(actionsCount.length + 1)
  }
  const handleAddCondition = () => {
    model.setCondition(conditionsCount.length + 1)
  }

  const handleDeleteExpression = (expression?: Condition | Action) => () => {
    if (isAction(expression)) {
      model.deleteActionFx(expression.id)
    }

    if (isCondition(expression)) {
      model.deleteConditonFx(expression.id)
    }
  }

  const handleSubmitAction =
    (id?: string) =>
    (action: AutomateActionCreateInputType | AutomateActionUpdateInputType) => {
      if (id) {
        model.updateActionFx({ ...omit(action, ['trigger', 'type']), id })
      } else {
        model.createActionFx(action as AutomateActionCreateInputType)
      }
    }

  const handleSubmitConditon =
    (id?: string) =>
    (
      condition:
        | AutomateConditionCreateInputType
        | AutomateActionUpdateInputType
    ) => {
      if (id) {
        model.updateConditionFx({ ...omit(condition, ['trigger', 'type']), id })
      } else {
        model.createConditionFx(condition as AutomateConditionCreateInputType)
      }
    }

  const handleOpenDeploy = async () => {
    try {
      const result = await openDeploy()

      props.onAddContract(result)
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  return (
    <Dialog>
      <div className={styles.root}>
        <Tabs>
          <Tab>Trigger</Tab>
          <Tab>Actions</Tab>
          <Tab>Conditions</Tab>
          <TabPanel>form</TabPanel>
          <TabPanel>
            {actionsCount.map((priority) => {
              const action = actions[priority]

              return (
                <div key={String(priority)}>
                  <AutomationTriggerExpression
                    onSubmitAction={handleSubmitAction(action?.id)}
                    type="action"
                    expression={action}
                    priority={Number(priority)}
                    // @ts-ignore
                    trigger={props.trigger?.id}
                    contracts={props.contracts}
                    onDeploy={handleOpenDeploy}
                    contacts={contacts}
                  />
                  <Button onClick={handleDeleteExpression(action)} size="small">
                    Delete
                  </Button>
                </div>
              )
            })}
            <Button onClick={handleAddAction} size="small">
              +
            </Button>
          </TabPanel>
          <TabPanel>
            {conditionsCount.map((priority) => {
              const condition = conditions[priority]

              return (
                <div key={String(priority)}>
                  <AutomationTriggerExpression
                    onSubmitCondition={handleSubmitConditon(condition?.id)}
                    type="condition"
                    expression={condition}
                    priority={Number(priority)}
                    // @ts-ignore
                    trigger={props.trigger?.id}
                    contracts={props.contracts}
                    onDeploy={handleOpenDeploy}
                    contacts={contacts}
                  />
                  <Button
                    onClick={handleDeleteExpression(condition)}
                    size="small"
                  >
                    Delete
                  </Button>
                </div>
              )
            })}
            <Button onClick={handleAddCondition} size="small">
              +
            </Button>
          </TabPanel>
        </Tabs>
      </div>
    </Dialog>
  )
}
