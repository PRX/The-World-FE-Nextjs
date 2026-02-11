import { gql } from "@apollo/client";
import { POST_CARD_PROPS } from "./post.fragment";
import { IMAGE_PROPS } from "./image.fragment";

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
  ${IMAGE_PROPS}
  ${POST_CARD_PROPS}
  ${MENU_ITEM_PROPS}
`;
