import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_MENTOR_SKILLS,
  DELETE_MENTOR_SKILLS,
  DUPLICATE_MENTOR_SKILLS,
  GET_ALL_MENTOR_SKILLS,
} from "../../../quries/mentorship/skills";

export const getAllMentorSkills = (options: any) =>
  useQuery(GET_ALL_MENTOR_SKILLS, options);

export const addMentorShipSkills = (options: any) =>
  useMutation(ADD_MENTOR_SKILLS, {
    onCompleted: options.onCompleted,
    update(cache, { data: { addMentorShipSkills } }) {
      try {
        const { getAllMentorSkills }: any = cache.readQuery({
          query: GET_ALL_MENTOR_SKILLS,
        });

        cache.writeQuery({
          query: GET_ALL_MENTOR_SKILLS,

          data: {
            getAllMentorSkills: [...addMentorShipSkills, ...getAllMentorSkills],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const deleteMentorShipSkills = (options: any) =>
  useMutation(DELETE_MENTOR_SKILLS, options);

export const duplicateMentorShipSkills = (options: any) =>
  useMutation(DUPLICATE_MENTOR_SKILLS, {
    update(cache, { data: { duplicateMentorShipSkills } }) {
      try {
        const { getAllMentorSkills }: any = cache.readQuery({
          query: GET_ALL_MENTOR_SKILLS,
        });

        cache.writeQuery({
          query: GET_ALL_MENTOR_SKILLS,

          data: {
            getAllMentorSkills: [
              ...duplicateMentorShipSkills,
              ...getAllMentorSkills,
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
