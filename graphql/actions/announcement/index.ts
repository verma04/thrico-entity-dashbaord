import { useMutation } from "@apollo/client";
import { ADD_ANNOUNCEMENT } from "../../quries/announcement";

export const addAnnouncement = (options: any) =>
  useMutation(ADD_ANNOUNCEMENT, options);
