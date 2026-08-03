"use client";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const GET_ALL_ANNOUNCEMENTS = gql`
  query GetAllAnnouncements {
    getAllAnnouncements {
      id
      subject
      description
      category
      entity
      allowReplies
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ANNOUNCEMENT = gql`
  query GetAnnouncement($getAnnouncementId: ID!) {
    getAnnouncement(id: $getAnnouncementId) {
      id
      subject
      description
      category
      entity
      allowReplies
      isActive
      createdAt
      updatedAt
    }
  }
`;

export type AnnouncementType = {
  id: string;
  subject: string;
  description: string;
  category: string;
  entity: string;
  allowReplies: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetAllAnnouncementsData = {
  getAllAnnouncements: AnnouncementType[];
};

export const useGetAllAnnouncements = () => {
  return useQuery<GetAllAnnouncementsData>(GET_ALL_ANNOUNCEMENTS);
};

export type GetAnnouncementData = {
  getAnnouncement: AnnouncementType;
};

export const useGetAnnouncement = (id: string) => {
  return useQuery<GetAnnouncementData>(GET_ANNOUNCEMENT, {
    variables: { getAnnouncementId: id },
  });
};
