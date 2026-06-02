import { gql } from "@apollo/client";

export const MENU_ITEM_PROPS = gql`
  fragment MenuItemProps on MenuItem {
    id
    parentId
    label
    url
    connectedNode {
      node {
        id
        ... on Category {
          posts(first: 20, where: {orderby: {field: DATE, order: DESC}}) {
            nodes {
              ...PostCardProps
            }
          }
        }
      }
    }
  }
`;

export const MENU_PROPS = gql`
  fragment MenuProps on Menu {
    menuItems(first: 100) {
      nodes {
        ...MenuItemProps
      }
    }
  }
  ${MENU_ITEM_PROPS}
`;
