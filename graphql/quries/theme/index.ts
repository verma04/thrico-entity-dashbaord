import { gql } from "@apollo/client";

export const GET_THEME = gql`
  query GetEntityTheme {
    getEntityTheme {
      Button {
        colorPrimary
        colorText
        colorBorder
        borderRadius
        defaultBg
        defaultColor
        defaultBorderColor
        fontSize
      }
      backgroundColor
      borderColor
      borderRadius
      borderStyle
      borderWidth
      boxShadow
      buttonColor
      inputBackground
      inputBorderColor
      primaryColor
      secondaryColor
      textColor
      hoverEffect
      fontWeight
      fontSize
    }
  }
`;

export const EDIT_THEME = gql`
  mutation EditEntityTheme($input: editEntityTheme) {
    editEntityTheme(input: $input) {
      Button {
        colorPrimary
        colorText
        colorBorder
        borderRadius
        defaultBg
        defaultColor
        defaultBorderColor
        fontSize
      }
      backgroundColor
      borderColor
      borderRadius
      borderStyle
      borderWidth
      boxShadow
      buttonColor
      inputBackground
      inputBorderColor
      primaryColor
      secondaryColor
      textColor
      hoverEffect
      fontWeight
      fontSize
    }
  }
`;
