import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ROLES,
  GET_ROLE_BY_ID,
  GET_AVAILABLE_MODULES,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  GET_ADMIN_USERS,
  GET_ADMIN_BY_ID,
  CREATE_ADMIN,
  UPDATE_ADMIN_USER,
  UPDATE_ADMIN_PASSWORD,
  UPDATE_ADMIN_USER_ROLE,
  DELETE_ADMIN_USER,
} from "../../quries/settings/roles";

export interface AdminAccess {
  reports: boolean;
  settings: boolean;
  subscription: boolean;
  platformFeatures: boolean;
  appearance: boolean;
  auditLogs: boolean;
  domain: boolean;
  permissions: boolean;
  adminUsers: boolean;
}

export interface ModulePermission {
  id: string;
  module: string;
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface GroupedModulePermissionItem {
  id?: string;
  module: string;
  canRead: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  isSystem?: boolean;
  isAdmin?: boolean;
}

export interface AvailableModuleItem {
  name: string;
  isSystem: boolean;
  isAdmin: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  isAdmin: boolean;
  adminAccess?: AdminAccess;
  modulePermissions: ModulePermission[];
  groupedModulePermissions?: Record<string, GroupedModulePermissionItem[]>;
  userCount?: number;
  usersCount?: number;
}

export interface GetRolesResponse {
  getRoles: Role[];
}

export interface GetRoleByIdResponse {
  getRoleById: Role;
}

export interface GetAvailableModulesResponse {
  getAvailableModules: Record<string, Array<AvailableModuleItem | string>>;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  isAdmin?: boolean;
  adminAccess?: Partial<AdminAccess>;
  modulePermissions?: Omit<ModulePermission, "id">[];
  groupedModulePermissions?: Record<string, any>;
}

export interface UpdateRoleInput {
  id: string;
  name?: string;
  description?: string;
  isAdmin?: boolean;
  adminAccess?: Partial<AdminAccess>;
  modulePermissions?: Omit<ModulePermission, "id">[];
  groupedModulePermissions?: Record<string, any>;
}

export interface CreateRoleResponse {
  createRole: {
    id: string;
    name: string;
    description: string;
    isAdmin: boolean;
    groupedModulePermissions?: Record<string, GroupedModulePermissionItem[]>;
  };
}

export interface UpdateRoleResponse {
  updateRole: {
    id: string;
    name: string;
    description: string;
    isAdmin: boolean;
    groupedModulePermissions?: Record<string, GroupedModulePermissionItem[]>;
  };
}

export interface DeleteRoleResponse {
  deleteRole: {
    success: boolean;
  };
}

export interface AdminUser {
  id: string;
  status: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isSuperAdmin: boolean;
  avatar?: string;
  permissions?: AdminAccess;
  modulePermissions?: ModulePermission[];
}

export interface GetAdminUsersResponse {
  getAdminUsers: {
    data: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AdminRegisterInput {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  avatar?: string;
}

export interface CreateAdminResponse {
  createAdmin: AdminUser;
}

export interface AdminUpdateInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: string;
  avatar?: string;
}

export interface UpdateAdminUserResponse {
  updateAdminUser: AdminUser;
}

export interface UpdateAdminPasswordResponse {
  updateAdminPassword: {
    success: boolean;
  };
}

export interface UpdateAdminUserRoleResponse {
  updateAdminUserRole: AdminUser;
}

export const useGetRoles = (options?: any) =>
  useQuery<GetRolesResponse>(GET_ROLES, options);

export const useGetRoleById = (id: string, options?: any) =>
  useQuery<GetRoleByIdResponse>(GET_ROLE_BY_ID, {
    variables: { id },
    skip: !id,
    ...options,
  });

export const useGetAvailableModules = (options?: any) =>
  useQuery<GetAvailableModulesResponse>(GET_AVAILABLE_MODULES, options);

export const useCreateRole = (options?: any) =>
  useMutation<CreateRoleResponse, { input: CreateRoleInput }>(CREATE_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
    ...options,
  });

export const useUpdateRole = (options?: any) =>
  useMutation<UpdateRoleResponse, { input: UpdateRoleInput }>(UPDATE_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
    ...options,
  });

export const useDeleteRole = (options?: any) =>
  useMutation<DeleteRoleResponse, { id: string }>(DELETE_ROLE, {
    refetchQueries: [{ query: GET_ROLES }],
    ...options,
  });

export const useGetAdminUsers = (options?: any) =>
  useQuery<GetAdminUsersResponse>(GET_ADMIN_USERS, options);

export const useGetAdminById = (adminId: string, options?: any) =>
  useQuery<{ getAdminById: AdminUser }>(GET_ADMIN_BY_ID, {
    variables: { adminId },
    skip: !adminId,
    ...options,
  });

export const useCreateAdmin = (options?: any) =>
  useMutation<CreateAdminResponse, { input: AdminRegisterInput }>(
    CREATE_ADMIN,
    {
      refetchQueries: [{ query: GET_ADMIN_USERS }],
      ...options,
    },
  );

export const useUpdateAdminUser = (options?: any) =>
  useMutation<
    UpdateAdminUserResponse,
    { adminId: string; input: AdminUpdateInput }
  >(UPDATE_ADMIN_USER, {
    refetchQueries: [{ query: GET_ADMIN_USERS }],
    ...options,
  });

export const useUpdateAdminPassword = (options?: any) =>
  useMutation<
    UpdateAdminPasswordResponse,
    { adminId: string; password: string }
  >(UPDATE_ADMIN_PASSWORD, options);

export const useUpdateAdminUserRole = (options?: any) =>
  useMutation<
    UpdateAdminUserRoleResponse,
    { adminId: string; roleId?: string | null }
  >(UPDATE_ADMIN_USER_ROLE, {
    refetchQueries: [{ query: GET_ADMIN_USERS }],
    ...options,
  });

export const useDeleteAdminUser = (options?: any) =>
  useMutation<{ deleteAdminUser: { success: boolean } }, { adminId: string }>(
    DELETE_ADMIN_USER,
    {
      refetchQueries: [{ query: GET_ADMIN_USERS }],
      ...options,
    },
  );
