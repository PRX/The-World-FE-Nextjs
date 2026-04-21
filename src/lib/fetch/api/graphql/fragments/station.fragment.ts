import { gql } from "@apollo/client";

export const STATION_CARD_PROPS = gql`
  fragment StationCardProps on Station {
    id
    title
    stationFields {
      stationInfo {
        callLetters
        frequency
        modulator
        website
      }
      schedule {
        startTimeUtc
      }
    }
    cities {
      nodes {
        id
        name
      }
    }
    provincesOrStates {
      nodes {
        id
        name
      }
    }
    countries {
      nodes {
        id
        name
      }
    }
  }
`;
