import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query GetRoles {
    getRoles {
      id
      name
      description
      isSystem
      adminAccess {
        website
        moderation
        reports
        settings
        subscription
        platformFeatures
        appearance
        auditLogs
        domain
        permissions
        adminUsers
        users
      }
      modulePermissions {
        id
        module
        canRead
        canCreate
        canEdit
        canDelete
      }
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
      adminAccess {
        website
        moderation
        reports
        settings
        subscription
        platformFeatures
        appearance
        auditLogs
        domain
        permissions
        adminUsers
        users
      }
      modulePermissions {
        id
        module
        canRead
        canCreate
        canEdit
        canDelete
      }
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
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      id
      name
      description
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
  query GetAdminUsers {
    getAdminUsers {
      id
      status
      email
      firstName
      lastName
      role {
        id
        name
        description
        isSystem
        adminAccess {
          website
          moderation
          reports
          settings
          subscription
          platformFeatures
          appearance
          auditLogs
          domain
          permissions
          adminUsers
          users
        }
        modulePermissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
        }
      }
      isSuperAdmin
    }
  }
`;

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: AdminRegisterInput!) {
    createAdmin(input: $input) {
      email
      firstName
      id
      isSuperAdmin
      lastName
      role {
        modulePermissions {
          id
          module
          canRead
          canCreate
          canEdit
          canDelete
        }
        isSystem

        description
        adminAccess {
          website
          moderation
          reports
          settings
          subscription
          platformFeatures
          appearance
          auditLogs
          domain
          permissions
          adminUsers
          users
        }
      }
      status
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
      role {
        id
        name
      }
      isSuperAdmin
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
  mutation UpdateAdminUserRole($adminId: ID!, $roleId: ID!) {
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
