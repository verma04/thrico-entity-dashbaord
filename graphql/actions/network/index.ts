import { useMutation, useQuery } from "@apollo/client";
import {
  ACCEPT_CONNECTION,
  GET_NETWORK,
  GET_USER_DETAILS,
  SEND_CONNECTION,
} from "../../quries/network";

export const getNetwork = () => useQuery(GET_NETWORK);

export const getUserDetails = (options: any) =>
  useQuery(GET_USER_DETAILS, options);

export const connectAsConnection = (options: any) =>
  useMutation(SEND_CONNECTION, {
    update(cache, { data: { connectAsConnection } }) {
      try {
        const { getNetwork }: any = cache.readQuery({
          query: GET_NETWORK,
        });

        const newData = getNetwork.map((item: any) => {
          if (item.id === connectAsConnection?.id) {
            return { ...item, status: connectAsConnection?.status };
          } else {
            return item;
          }
        });

        cache.writeQuery({
          query: GET_NETWORK,
          data: { getNetwork: [...newData] },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const acceptConnection = (options: any) =>
  useMutation(ACCEPT_CONNECTION, {
    update(cache, { data: { acceptConnection } }) {
      try {
        const { getNetwork }: any = cache.readQuery({
          query: GET_NETWORK,
        });

        const newData = getNetwork.map((item: any) => {
          if (item.id === acceptConnection?.id) {
            return { ...item, status: acceptConnection?.status };
          } else {
            return item;
          }
        });

        cache.writeQuery({
          query: GET_NETWORK,
          data: { getNetwork: [...newData] },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });
