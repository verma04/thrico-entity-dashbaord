import { gql } from "@apollo/client";

export const CHECK_CUSTOM_PAGES = gql`
  query CheckCustomPages {
    checkCustomPages {
      pagesTypes
      userName
      password
      url
      isReady
      entity
      pages {
        content
        metaTitle
        metaDescription
        metaKeywords
        canonicalUrl
        ogTitle
        ogDescription
        ogImage
        twitterTitle
        twitterDescription
        twitterImage
        createdAt
        isPublished
        slug
        id
      }
    }
  }
`;

export const CUSTOM_PAGE_WORDPRESS = gql`
  mutation CustomPagesWordpress {
    customPagesWordpress {
      pagesTypes
      userName
      password
      url
      isReady
      entity
    }
  }
`;
export const SYNC_WORD_PRESS_PAGES = gql`
  mutation SyncWordPressPages {
    syncWordPressPages {
      content
      metaTitle
      metaDescription
      metaKeywords
      canonicalUrl
      ogTitle
      ogDescription
      ogImage
      twitterTitle
      twitterDescription
      twitterImage
      createdAt
      isPublished
      slug
      id
    }
  }
`;
