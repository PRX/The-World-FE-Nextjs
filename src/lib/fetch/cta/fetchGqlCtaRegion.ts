/**
 * Fetch Segment data from CMS API.
 *
 * @param id Segment identifier.
 */

import type { Maybe, CtaRegion, CtaRegionIdType } from "@/interfaces";
import { gql } from "@apollo/client";
import { getClient } from "@/lib/fetch/api";
import { CTA_PROPS, CTA_REGION_PROPS } from "@/lib/fetch/api/graphql";

export const GET_CTA_REGION = gql`
  query getCtaRegion($id: ID!, $idType: CtaRegionIdType) {
    ctaRegion(id: $id, idType: $idType) {
      ...CtaRegionProps
    }
  }
  ${CTA_REGION_PROPS}
  ${CTA_PROPS}
`;

export async function fetchGqlCtaRegion(
  id: string,
  idType?: CtaRegionIdType,
  authToken?: string,
) {
  const gqlClient = getClient(authToken);
  const response = await gqlClient.query<{
    ctaRegion: Maybe<CtaRegion>;
  }>({
    query: GET_CTA_REGION,
    variables: {
      id,
      idType,
    },
  });
  const { ctaRegion } = response?.data || {};

  if (!ctaRegion) return undefined;

  return ctaRegion;
}

export default fetchGqlCtaRegion;
