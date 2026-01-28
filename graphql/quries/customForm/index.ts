import { gql } from "@apollo/client";

const custom = `
     id
      appearance
      previewType
      description
 
      fields {
        id
        formId
        question
        type
        order
        options
        required
        maxLength
        scale
        ratingType
        min
        max
        labels
        allowMultiple
        fieldName
        defaultValue
        allowedTypes
        maxSize
      }
      status
      title
      startDate
      endDate
`;

export const ADD_CUSTOM_FORM = gql`
 mutation AddCustomForm($input: InputCustomForm!) {
  addCustomForm(input: $input) {
 ${custom}
    }
  }
`;

export const UPDATE_CUSTOM_FORM = gql`
 mutation UpdateCustomForm($input: inputUpdateCustomForm!) {
  updateCustomForm(input: $input) {
 ${custom}
    }
  }
`;

export const GET_ALL_CUSTOM_FORM = gql`
query GetCustomForms($input: inputGetCustomForm) {
  getCustomForms(input: $input) {
     ${custom}
  }
}`;
