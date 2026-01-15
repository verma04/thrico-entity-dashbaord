"use client";

import * as React from "react";
import { ApolloLink } from "@apollo/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloNextAppProvider,
} from "@apollo/client-integration-nextjs";
import { onError } from "@apollo/client/link/error";
import { toast } from "sonner";
import { createUploadLink } from "apollo-upload-client";
import { useTokenStore } from "@/store/store";

interface Props {
  children?: React.ReactNode;
  host?: string;
}

export function ApolloWrapper({ children }: Props) {
  const token = useTokenStore((state) => state.token);

  function makeClient() {
    const errorControl = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, extensions }) => {
          toast({
            title: "Error",
            description:
              extensions?.code === "INTERNAL_SERVER_ERROR"
                ? "Something went wrong"
                : message,
            variant: "destructive",
          });
        });
      }
      if (networkError) {
        toast({
          title: "Network Error",
          description: networkError.message,
          variant: "destructive",
        });
      }
    });

    const uploadLink = createUploadLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    });

    const authMiddleware = new ApolloLink(
      (operation: import("@apollo/client").Operation, forward) => {
        operation.setContext({
          headers: {
            authorization:
              typeof window !== "undefined" &&
              localStorage.getItem("token") === null
                ? null
                : typeof window !== "undefined" &&
                  JSON.parse(localStorage?.getItem("token") || "{}").state
                    ?.token,
            "Apollo-Require-Preflight": "true",
            // Add the IP to headers
          },
        });

        return forward(operation);
      }
    );
    return new ApolloClient({
      link: ApolloLink.from([authMiddleware, errorControl, uploadLink]),
      cache: new InMemoryCache(),
    });
  }

  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
