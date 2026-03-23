import type { ContentNodeConnection, TermNodeConnection } from "@/interfaces";
import { NextResponse, type NextRequest } from "next/server";
import { gql } from "@apollo/client";
import { gqlClient } from "@/lib/fetch";
import { IMAGE_PROPS } from "@/lib/fetch/api/graphql";

const GET_SEARCH_RESULTS = gql`
  query getSearchResults($search: String) {
    contentNodes (first: 10, where: { search: $search }) {
      nodes {
        contentTypeName
        id
        date
        link
        ...on NodeWithTitle {
          title
        }
        ...on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...ImageProps
            }
          }
        }
      }
    }
    terms (first: 10, where: { search: $search, hideEmpty: true, orderby: COUNT order: DESC }) {
      nodes {
        id
        taxonomyName
        name
        link
        count
        ...on Contributor {
        contributorDetails {
          image {
            ...ImageProps
          }
        }
      }
      }
    }
  }
  ${IMAGE_PROPS}
`;

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const response = await gqlClient.query<{
      contentNodes?: ContentNodeConnection;
      terms?: TermNodeConnection;
    }>({
      query: GET_SEARCH_RESULTS,
      variables: {
        search,
      },
    });
    const data = {
      contentNodes: response?.data?.contentNodes?.nodes,
      terms: response?.data?.terms?.nodes,
    };

    if (!data) {
      return NextResponse.json(
        { message: "Unable to query content" },
        { status: 400 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 },
    );
  }
}
