import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  ADD_CUSTOM_DOMAIN,
  CHECK_DNS_STATUS,
  GET_CUSTOM_DOMAIN,
  GET_DOMAIN_DETAILS,
  GET_THRICO_DOMAIN,
  DELETE_DOMAIN,
  CHECK_SSL,
} from "../../quries/domains";

export const addCustomDomain = (options: any) =>
  useMutation(ADD_CUSTOM_DOMAIN, {
    onCompleted: options.onCompleted,
  });

export const getCustomDomainDetails = (options: any) =>
  useQuery(GET_DOMAIN_DETAILS, options);

export const checkUpdatedDnsRecord = (options: any) =>
  useMutation(CHECK_DNS_STATUS, {
    update(cache, { data: { checkUpdatedDnsRecord } }) {
      try {
        console.log(checkUpdatedDnsRecord);
        if (checkUpdatedDnsRecord?.id) {
          cache.writeQuery({
            query: GET_DOMAIN_DETAILS,
            data: { getCustomDomainDetails: checkUpdatedDnsRecord },
            variables: {
              input: {
                id: checkUpdatedDnsRecord?.id,
              },
            },
          });
        }
        // const { getAllFeed }: any = cache.readQuery({
        //   query: GET_DOMAIN_DETAILS,
        //   variables: {
        //     input: {
        //       offset: 0,
        //       limit: 10, // Match the limit in your Following screen
        //     },
        //   },
        // });
      } catch (error) {
        console.log(error);
      }
    },
  });

export const getThricoDomain = () => useQuery(GET_THRICO_DOMAIN);

export const getCustomDomain = () => useQuery(GET_CUSTOM_DOMAIN);

export const deleteDomain = (options: any) =>
  useMutation(DELETE_DOMAIN, {
    onCompleted: options.onCompleted,
    update(cache, { data: { deleteDomain } }) {
      try {
        cache.evict({ fieldName: "getCustomDomainDetails" });
        cache.evict({ fieldName: "getCustomDomain" });
        cache.gc();
        cache.gc();
      } catch (error) {
        console.log(error);
      }
    },
  });

export const checkSSl = (options: any) => useQuery(CHECK_SSL);
