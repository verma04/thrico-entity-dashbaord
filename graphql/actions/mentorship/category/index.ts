import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_MENTOR_CATEGORY,
  DELETE_MENTOR_CATEGORY,
  DUPLICATE_MENTOR_CATEGORY,
  GET_ALL_MENTOR,
  GET_ALL_MENTOR_CATEGORY,
  MENTOR_SHIP_ACTION,
} from "../../../quries/mentorship/category";

export const getAllMentorCategory = (options: any) =>
  useQuery(GET_ALL_MENTOR_CATEGORY, options);

export const addMentorShipCategory = (options: any) =>
  useMutation(ADD_MENTOR_CATEGORY, {
    onCompleted: options.onCompleted,
    update(cache, { data: { addMentorShipCategory } }) {
      try {
        const { getAllMentorCategory }: any = cache.readQuery({
          query: GET_ALL_MENTOR_CATEGORY,
        });

        cache.writeQuery({
          query: GET_ALL_MENTOR_CATEGORY,

          data: {
            getAllMentorCategory: [
              ...addMentorShipCategory,
              ...getAllMentorCategory,
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const deleteMentorShipCategory = (options: any) =>
  useMutation(DELETE_MENTOR_CATEGORY, options);

export const duplicateMentorShipCategory = (options: any) =>
  useMutation(DUPLICATE_MENTOR_CATEGORY, {
    update(cache, { data: { duplicateMentorShipCategory } }) {
      try {
        const { getAllMentorCategory }: any = cache.readQuery({
          query: GET_ALL_MENTOR_CATEGORY,
        });

        cache.writeQuery({
          query: GET_ALL_MENTOR_CATEGORY,

          data: {
            getAllMentorCategory: [
              ...duplicateMentorShipCategory,
              ...getAllMentorCategory,
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const getAllMentor = (options: any) => useQuery(GET_ALL_MENTOR, options);

export const mentorShipActions = (options: any) =>
  useMutation(MENTOR_SHIP_ACTION, {
    onCompleted: options.onCompleted,
  });
