import {
  type ContentSearchFilters,
  ContentSearchFiltersSchema,
  SFContentSortEnum,
  SFContentTypeEnum,
} from "@/gen/search_filters_pb";
import {
  ContentTypeEnum,
  OrderEnum,
  PostObjectsConnectionOrderbyEnum,
  type RootQueryToContentNodeConnectionWhereArgs,
} from "@/interfaces";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { MessageInitShape } from "@bufbuild/protobuf";
import { isArray, isUndefined } from "lodash";

export function convertSearchFiltersToWhereArgs(
  searchFilters?: MessageInitShape<typeof ContentSearchFiltersSchema>,
) {
  let whereArgs = {} as RootQueryToContentNodeConnectionWhereArgs;
  const contentTypeEnumMap = new Map([
    [SFContentTypeEnum.POST, ContentTypeEnum.Post],
    [SFContentTypeEnum.SEGMENT, ContentTypeEnum.Segment],
    [SFContentTypeEnum.EPISODE, ContentTypeEnum.Episode],
  ]);
  const whereContentType =
    !isUndefined(searchFilters?.contentType) &&
    contentTypeEnumMap.get(searchFilters.contentType);
  if (whereContentType) {
    whereArgs.contentTypes = [whereContentType];
  }

  if (searchFilters?.year) {
    whereArgs.dateQuery = {
      ...whereArgs.dateQuery,
      year: searchFilters.year,
    };
  }

  if (searchFilters?.month) {
    whereArgs.dateQuery = {
      ...whereArgs.dateQuery,
      month: searchFilters.month,
    };
  }

  if (searchFilters?.day) {
    whereArgs.dateQuery = {
      ...whereArgs.dateQuery,
      day: searchFilters.day,
    };
  }

  const sortMap = new Map<
    SFContentSortEnum,
    Partial<RootQueryToContentNodeConnectionWhereArgs>
  >([
    [
      SFContentSortEnum.NEWEST,
      {
        orderby: [
          {
            field: PostObjectsConnectionOrderbyEnum.Date,
            order: OrderEnum.Desc,
          },
        ],
      },
    ],
    [
      SFContentSortEnum.OLDEST,
      {
        orderby: [
          {
            field: PostObjectsConnectionOrderbyEnum.Date,
            order: OrderEnum.Asc,
          },
        ],
      },
    ],
    [
      SFContentSortEnum.TITLE_AZ,
      {
        orderby: [
          {
            field: PostObjectsConnectionOrderbyEnum.Title,
            order: OrderEnum.Asc,
          },
        ],
      },
    ],
    [
      SFContentSortEnum.TITLE_ZA,
      {
        orderby: [
          {
            field: PostObjectsConnectionOrderbyEnum.Title,
            order: OrderEnum.Desc,
          },
        ],
      },
    ],
  ]);
  const whereSortArgs = searchFilters?.sort && sortMap.get(searchFilters.sort);
  if (whereSortArgs) {
    whereArgs = {
      ...whereArgs,
      ...whereSortArgs,
    };
  }

  return whereArgs;
}

export function convertSFParamToWhereArgs(sfParam?: string | string[]) {
  const sf = isArray(sfParam) ? sfParam.join(", ") : sfParam;

  if (!sf) return undefined;

  const searchFilters = decodeContentSearchFiltersParam(sf);

  return convertSearchFiltersToWhereArgs(searchFilters);
}

export default convertSFParamToWhereArgs;
