import { useQuery, useMutation } from "@apollo/client";
import {
  GET_COMMUNITY_MEMBERS,
  GET_COMMUNITY_MEMBER_REQUESTS,
  REMOVE_COMMUNITY_MEMBER,
  CHANGE_COMMUNITY_MEMBER_ROLE,
} from "../../../quries/group/members";

export const getCommunityMembers = (options: any) =>
  useQuery(GET_COMMUNITY_MEMBERS, options);

export const getCommunityMemberRequests = (options: any) =>
  useQuery(GET_COMMUNITY_MEMBER_REQUESTS, options);

export const removeCommunityMember = (options?: any) =>
  useMutation(REMOVE_COMMUNITY_MEMBER, options);

export const changeCommunityMemberRole = (options?: any) =>
  useMutation(CHANGE_COMMUNITY_MEMBER_ROLE, options);

