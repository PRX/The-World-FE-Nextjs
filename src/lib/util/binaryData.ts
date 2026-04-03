import "core-js/proposals/array-buffer-base64";
import { ContentSearchFiltersSchema } from "@/gen/search_filters_pb";
import {
  create,
  fromBinary,
  toBinary,
  type MessageInitShape,
} from "@bufbuild/protobuf";

export function encodeContentSearchFiltersParam(
  data?: MessageInitShape<typeof ContentSearchFiltersSchema>,
) {
  const whereArgs = create(ContentSearchFiltersSchema, data);
  const binaryData = toBinary(ContentSearchFiltersSchema, whereArgs);
  const urlSafeBase64 = binaryData.toBase64?.({
    alphabet: "base64url",
    omitPadding: true,
  });

  return urlSafeBase64 as string;
}

export function decodeContentSearchFiltersParam(urlSafeBase64?: string) {
  const binaryData = Uint8Array.fromBase64(urlSafeBase64 || "", {
    alphabet: "base64url",
  });

  const options = fromBinary(ContentSearchFiltersSchema, binaryData);

  return options;
}
