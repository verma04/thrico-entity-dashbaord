import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query GetRoles {
    getRoles {
      id
      name
      description
      isSystem
      isAdmin
      adminAccess {
        reports
        settings
        subscription
        platformFeatures
        appearance
        auditLogs
        domain
        permissions
        adminUsers
      }
      groupedModulePermissions {
        category
        permissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
          isSystem
          isAdmin
        }
      }
      userCount
      usersCount
    }
  }
`;

export const GET_ROLE_BY_ID = gql`
  query GetRoleById($id: ID!) {
    getRoleById(id: $id) {
      id
      name
      description
      isSystem
      isAdmin
      adminAccess {
        reports
        settings
        subscription
        platformFeatures
        appearance
        auditLogs
        domain
        permissions
        adminUsers
      }
      groupedModulePermissions {
        category
        permissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
          isSystem
          isAdmin
        }
      }
      userCount
      usersCount
    }
  }
`;

export const GET_AVAILABLE_MODULES = gql`
  query GetAvailableModules {
    getAvailableModules
  }
`;

export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      id
      name
      description
      isAdmin
      groupedModulePermissions {
        category
        permissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
          isSystem
          isAdmin
        }
      }
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      id
      name
      description
      isAdmin
      groupedModulePermissions {
        category
        permissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
          isSystem
          isAdmin
        }
      }
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      success
    }
  }
`;

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers($page: Int, $limit: Int) {
    getAdminUsers(page: $page, limit: $limit) {
      data {
        id
        status
        email
        firstName
        lastName
        isSystem
        isSuperAdmin
        roleId
        memberStatus
        role {
          id
          name
          description
          isSystem
          isAdmin
          groupedModulePermissions {
            category
            permissions {
              id
              module
              canRead
              canCreate
              canEdit
              canDelete
              isSystem
              isAdmin
            }
          }
        }
        groupedModulePermissions {
          category
          permissions {
            id
            module
            canRead
            canCreate
            canEdit
            canDelete
            isSystem
            isAdmin
          }
        }
      }
      total
      page
      limit
      totalPages
    }
  }
`;

export const GET_ADMIN_BY_ID = gql`
  query GetAdminById($adminId: ID!) {
    getAdminById(adminId: $adminId) {
      id
      status
      email
      firstName
      lastName
      isSystem
      isSuperAdmin
      roleId
      memberStatus
      role {
        id
        name
        description
        isSystem
        isAdmin
        groupedModulePermissions {
          category
          permissions {
            id
            module
            canRead
            canCreate
            canEdit
            canDelete
            isSystem
            isAdmin
          }
        }
      }
      groupedModulePermissions {
        category
        permissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
          isSystem
          isAdmin
        }
      }
    }
  }
`;

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: AdminRegisterInput!) {
    createAdmin(input: $input) {
      id
      status
      email
      firstName
      lastName
      isSuperAdmin
      isSystem
      roleId
      role {
        id
        name
        description
        isSystem
        isAdmin
        groupedModulePermissions {
          category
          permissions {
            id
            module
            canRead
            canCreate
            canEdit
            canDelete
            isSystem
            isAdmin
          }
        }
      }
      groupedModulePermissions {
        category
        permissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
          isSystem
          isAdmin
        }
      }
    }
  }
`;

export const UPDATE_ADMIN_USER = gql`
  mutation UpdateAdminUser($adminId: ID!, $input: AdminUpdateInput!) {
    updateAdminUser(adminId: $adminId, input: $input) {
      id
      status
      email
      firstName
      lastName
      isSuperAdmin
      isSystem
      roleId
      role {
        id
        name
        description
        isSystem
        isAdmin
        groupedModulePermissions {
          category
          permissions {
            id
            module
            canRead
            canCreate
            canEdit
            canDelete
            isSystem
            isAdmin
          }
        }
      }
      groupedModulePermissions {
        category
        permissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
          isSystem
          isAdmin
        }
      }
    }
  }
`;

export const UPDATE_ADMIN_PASSWORD = gql`
  mutation UpdateAdminPassword($adminId: ID!, $password: String!) {
    updateAdminPassword(adminId: $adminId, password: $password) {
      success
    }
  }
`;

export const UPDATE_ADMIN_USER_ROLE = gql`
  mutation UpdateAdminUserRole($adminId: ID!, $roleId: ID) {
    updateAdminUserRole(adminId: $adminId, roleId: $roleId) {
      id
      status
      email
      firstName
      lastName
      role {
        id
        name
      }
      isSuperAdmin
    }
  }
`;

export const DELETE_ADMIN_USER = gql`
  mutation DeleteAdminUser($adminId: ID!) {
    deleteAdminUser(adminId: $adminId) {
      success
    }
  }
`;
