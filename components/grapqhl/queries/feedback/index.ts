import { gql } from "@apollo/client";

export const ADD_FEEDBACK_FORM = gql`
  mutation AddFeedBackForm($input: inputFeedForm) {
    addFeedBackForm(input: $input) {
      id
      title
      type
    }
  }
`;

export const GET_FEEDBACK_TYPE = gql`
  query GetFeedbackFormByType($input: feedBackType!) {
    getFeedbackFormByType(input: $input) {
      id
      title
      type
      slug
    }
  }
`;
export const EDIT_FEEDBACK = gql`
  mutation EditFeedBackForm($input: inputEditFeedForm) {
    editFeedBackForm(input: $input) {
      id
      title
      type
      slug
    }
  }
`;
export const DUPLICATE_FEEDBACK = gql`
  mutation DuplicateFeedBackForm($input: inputDuplicateFeedBackForm) {
    duplicateFeedBackForm(input: $input) {
      id
      title
      type
      slug
    }
  }
`;

export const GET_FEEDBACK_QUESTION = gql`
  query GetFeedbackQuestion($input: id) {
    getFeedbackQuestion(input: $input) {
      feedBackQuestion {
        createdAt
        id
        isRequired
        questionType
        updatedAt
      }
    }
  }
`;
export const ADD_FEEDBACK_QUESTION = gql`
  mutation AddFeedBackQuestion($input: addQuestionFeedback) {
    addFeedBackQuestion(input: $input) {
      id
      questionType
      createdAt
      updatedAt
      isRequired
    }
  }
`;
