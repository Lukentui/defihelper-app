import { getAPIClient } from '~/api'
import {
  UsersQuery,
  UsersQueryVariables,
  UsersRegisteringHistoryQuery,
  UsersRegisteringHistoryQueryVariables,
  UserUpdateMutation,
  UserUpdateMutationVariables,
} from '~/graphql/_generated-types'
import { USERS, USER_UPDATE, USER_REGISTERING_HISTORY } from './graphql'

export const usersApi = {
  getUsers: (variables: UsersQueryVariables) =>
    getAPIClient()
      .query<UsersQuery, UsersQueryVariables>(USERS, variables)
      .toPromise()
      .then(({ data }) => ({
        list: data?.users.list ?? [],
        count: data?.users.pagination.count ?? 0,
      })),

  updateUser: (variables: UserUpdateMutationVariables) =>
    getAPIClient()
      .mutation<UserUpdateMutation, UserUpdateMutationVariables>(
        USER_UPDATE,
        variables
      )
      .toPromise()
      .then(({ data }) => data?.userUpdate),

  getUsersRegisteringHistory: (
    variables: UsersRegisteringHistoryQueryVariables
  ) =>
    getAPIClient()
      .query<
        UsersRegisteringHistoryQuery,
        UsersRegisteringHistoryQueryVariables
      >(USER_REGISTERING_HISTORY, variables)
      .toPromise()
      .then(({ data }) => data?.usersRegisteringHistory),
}
