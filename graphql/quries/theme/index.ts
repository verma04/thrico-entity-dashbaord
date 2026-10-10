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
      Navigation {
        tabBg
        tabActiveColor
        tabActiveBg
        tabInactiveColor
        tabBorderColor
        tabStyle
        tabIndicatorColor
        tabLayoutVariant
        tabBadgeBg
        tabBadgeColor
        tabSize
      }
      Sidebar {
        sidebarBg
        sidebarTextColor
        sidebarActiveColor
        sidebarActiveBg
        sidebarBorderColor
        sidebarHeaderBg
      }
      BottomSheet {
        sheetBg
        sheetHandleColor
        sheetBorderRadius
        sheetHeaderBg
        sheetHeaderTextColor
        sheetBorderColor
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
  mutation EditEntityTheme($input: EditEntityTheme) {
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
      Navigation {
        tabBg
        tabActiveColor
        tabActiveBg
        tabInactiveColor
        tabBorderColor
        tabStyle
        tabIndicatorColor
        tabLayoutVariant
        tabBadgeBg
        tabBadgeColor
        tabSize
      }
      Sidebar {
        sidebarBg
        sidebarTextColor
        sidebarActiveColor
        sidebarActiveBg
        sidebarBorderColor
        sidebarHeaderBg
      }
      BottomSheet {
        sheetBg
        sheetHandleColor
        sheetBorderRadius
        sheetHeaderBg
        sheetHeaderTextColor
        sheetBorderColor
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
