import { SFContentSortEnum, SFContentTypeEnum } from "@/gen/search_filters_pb";
import {
  ContentTypeEnum,
  OrderEnum,
  PostObjectsConnectionOrderbyEnum,
  type RootQueryToContentNodeConnectionWhereArgs,
} from "@/interfaces";
import { decodeContentSearchFiltersParam } from "@/lib/util/binaryData";
import { isArray, isUndefined } from "lodash";

export function convertSFParamToWhereArgs(sfParam?: string | string[]) {
  const sf = isArray(sfParam) ? sfParam.join(", ") : sfParam;

  if (!sf) return undefined;

  const options = decodeContentSearchFiltersParam(sf);

  let whereArgs = {} as RootQueryToContentNodeConnectionWhereArgs;
  const contentTypeEnumMap = new Map([
    [SFContentTypeEnum.POST, ContentTypeEnum.Post],
    [SFContentTypeEnum.SEGMENT, ContentTypeEnum.Segment],
    [SFContentTypeEnum.EPISODE, ContentTypeEnum.Episode],
  ]);
  const whereContentType =
    !isUndefined(options?.contentType) &&
    contentTypeEnumMap.get(options.contentType);
  if (whereContentType) {
    whereArgs.contentTypes = [whereContentType];
  }

  if (options?.year) {
    whereArgs.dateQuery = {
      ...whereArgs.dateQuery,
      year: options.year,
    };
  }

  if (options?.month) {
    whereArgs.dateQuery = {
      ...whereArgs.dateQuery,
      month: options.month,
    };
  }

  if (options?.day) {
    whereArgs.dateQuery = {
      ...whereArgs.dateQuery,
      day: options.day,
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
  const whereSortArgs = options?.sort && sortMap.get(options.sort);
  if (whereSortArgs) {
    whereArgs = {
      ...whereArgs,
      ...whereSortArgs,
    };
  }

  return whereArgs;
}

export default convertSFParamToWhereArgs;
