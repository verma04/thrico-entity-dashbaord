// Apollo Client mutation for saving footer config
export const SAVE_FOOTER_CONFIG_ACTION = gql`
  mutation SaveFooterConfig($input: FooterConfigInput!) {
    saveFooterConfig(input: $input)
  }
`;

// TypeScript input type for saving footer config
export type FooterConfigInput = {
  companyInfo: {
    name: string | null;
    description: string | null;
    logo: string | null;
  };
  contactInfo: {
    address: string | null;
    phone: string | null;
    email: string | null;
  };
  socialMedia: Array<{
    platform: string | null;
    url: string | null;
  }>;
  footerSections: Array<{
    title: string | null;
    links: Array<{
      label: string | null;
      href: string | null;
    }>;
  }>;
  copyright: {
    text: string | null;
    showYear: boolean | null;
  };
  newsletter: {
    enabled: boolean | null;
    title: string | null;
    description: string | null;
  };
};

// Apollo Client hook for saving footer config
export function useSaveFooterConfig() {
  return useMutation(SAVE_FOOTER_CONFIG_ACTION);
}
// Apollo Client action for GetFooterConfig (IT Support)
export const GET_FOOTER_CONFIG_ACTION = gql`
  query GetFooterConfig {
    getFooterConfig {
      companyInfo {
        name
        description
        logo
      }
      contactInfo {
        address
        phone
        email
      }
      socialMedia {
        platform
        url
      }
      footerSections {
        title
        links {
          label
          href
        }
      }
      copyright {
        text
        showYear
      }
      newsletter {
        enabled
        title
        description
      }
    }
  }
`;

// TypeScript type for GetFooterConfig response
export type FooterConfig = {
  companyInfo: {
    name: string;
    description: string;
    logo: string;
  };
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  footerSections: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  copyright: {
    text: string;
    showYear: boolean;
  };
  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
  };
};

// Apollo Client hook for GetFooterConfig
export function useGetFooterConfig() {
  return useQuery<{ getFooterConfig: FooterConfig }>(GET_FOOTER_CONFIG_ACTION);
}
import { gql, useMutation, useQuery } from "@apollo/client";
// Apollo Client mutation action for saving navigation menus
export const SAVE_NAVIGATION_MENUS_ACTION = gql`
  mutation SaveNavigationMenus($input: [MenuItemInput]!) {
    saveNavigationMenus(input: $input)
  }
`;

export function useSaveNavigationMenus() {
  return useMutation(SAVE_NAVIGATION_MENUS_ACTION);
}
// TypeScript input type for saving navigation menus
export type MenuItemInput = {
  key: string;
  label: string;
  icon?: string;
  href?: string;
  children?: MenuItemInput[];
};

// GraphQL mutation for saving navigation menus
export const SAVE_NAVIGATION_MENUS_MUTATION = `
  mutation SaveNavigationMenus($input: [MenuItemInput]!) {
    saveNavigationMenus(input: $input)
  }
`;

// ...existing code...

// Apollo Client action for GetNavigationMenus
export const GET_NAVIGATION_MENUS_ACTION = gql`
  query GetNavigationMenus {
    getNavigationMenus {
      key
      label
      icon
      href
      children {
        key
        label
        icon
        href
      }
    }
  }
`;

export function useGetNavigationMenus() {
  return useQuery<{ getNavigationMenus: NavigationMenu[] }>(
    GET_NAVIGATION_MENUS_ACTION
  );
}
// TypeScript type for GetNavigationMenus
export type NavigationMenu = {
  key: string;
  label: string;
  icon?: string;
  href?: string;
  children?: NavigationMenu[];
};

// GraphQL query for GetNavigationMenus
export const GET_NAVIGATION_MENUS = `
	query GetNavigationMenus {
		getNavigationMenus {
			key
			label
			icon
			href
			children {
				key
				label
				icon
				href
			}
		}
	}
`;
