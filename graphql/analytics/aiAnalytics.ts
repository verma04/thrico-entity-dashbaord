import { gql, useMutation, MutationHookOptions } from "@apollo/client";

export const ASK_AI_AGENT = gql`
  mutation AskAgent($input: AskAgentInput!) {
    askAgent(input: $input) {
      sessionId
      message
      widgets
      actions {
        label
        payload
      }
    }
  }
`;

export interface AskAgentInput {
  message: string;
  sessionId?: string;
}

export interface AskAgentResponse {
  askAgent: {
    sessionId: string;
    message: string;
    widgets?: any;
    actions?: Array<{
      label: string;
      payload: any;
    }>;
  };
}

export const useAiAnalyticsChat = (
  options?: MutationHookOptions<AskAgentResponse, { input: AskAgentInput }>
) => {
  const [askAgentMutation, { data, loading, error }] = useMutation<
    AskAgentResponse,
    { input: AskAgentInput }
  >(ASK_AI_AGENT, options);

  const sendMessage = async (message: string, sessionId?: string) => {
    const res = await askAgentMutation({
      variables: {
        input: { message, sessionId },
      },
    });
    return res.data?.askAgent;
  };

  return { sendMessage, data, loading, error };
};
