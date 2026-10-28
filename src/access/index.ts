import type { Access, FieldAccess, Where } from 'payload'

type UserWithRoles = { roles?: string[] | null } | null | undefined

export const userIsAdmin = (user: UserWithRoles): boolean =>
  Boolean(user?.roles?.includes('admin'))

export const anyone: Access = () => true

export const isAdmin: Access = ({ req: { user } }) => userIsAdmin(user)

export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)

export const adminOnlyFieldAccess: FieldAccess = ({ req: { user } }) => userIsAdmin(user)

export const isCustomer: FieldAccess = ({ req: { user } }) =>
  Boolean(user && !userIsAdmin(user))

export const adminOrPublishedStatus: Access = ({ req: { user } }) => {
  if (userIsAdmin(user)) return true

  const publishedOnly: Where = { _status: { equals: 'published' } }

  return publishedOnly
}

export const isDocumentOwner: Access = ({ req: { user } }) => {
  if (userIsAdmin(user)) return true

  if (user?.id) {
    const ownDocuments: Where = { customer: { equals: user.id } }

    return ownDocuments
  }

  return false
}
