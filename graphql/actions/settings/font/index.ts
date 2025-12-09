import { useMutation } from "@apollo/client";
import { UPDATE_FONT } from "../../../quries/settings/font";

export const updateFont = (options: any) => useMutation(UPDATE_FONT);
