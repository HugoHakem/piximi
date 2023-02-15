import * as T from "io-ts";
import { getOrElseW } from "fp-ts/Either";
import { failure } from "io-ts/PathReporter";

//#region COCO Serialization Type

const SerializedCOCOInfoRtype = T.type({
  year: T.Integer,
  version: T.string,
  description: T.string,
  contributor: T.string,
  url: T.string,
  date_created: T.string,
});

const SerializedCOCOImageRType = T.type({
  id: T.Integer,
  width: T.Integer,
  height: T.Integer,
  file_name: T.string,
  license: T.Integer,
  flickr_url: T.string,
  coco_url: T.string,
  date_captured: T.string,
});

const SerializedCOCOLicenseRType = T.type({
  id: T.Integer,
  name: T.string,
  url: T.string,
});

const SerializedCOCOAnnotationRType = T.type({
  id: T.Integer,
  image_id: T.Integer,
  category_id: T.Integer,
  segmentation: T.array(T.array(T.number)),
  area: T.number,
  bbox: T.tuple([T.number, T.number, T.number, T.number]),
});

const SerializedCOCOCategoryRType = T.type({
  id: T.Integer,
  name: T.string,
  supercategory: T.string,
});

export const SerializedCOCOFileRType = T.type({
  info: SerializedCOCOInfoRtype,
  images: T.array(SerializedCOCOImageRType),
  annotations: T.array(SerializedCOCOAnnotationRType),
  licenses: T.array(SerializedCOCOLicenseRType),
  categories: T.array(SerializedCOCOCategoryRType),
});

//#endregion COCO Serialization Type

//#region Basic Serialization Type

const SerializedCategoryRType = T.type({
  id: T.string,
  color: T.string, // 3 byte hex, eg "#a08cd2"
  name: T.string,
  visible: T.boolean,
});

export const SerializedAnnotationRType = T.type({
  categoryId: T.string, // category id, matching id of a SerializedCategory
  id: T.string,
  mask: T.string, // e.g. "114 1 66 1 66 2 ..."
  plane: T.number,
  boundingBox: T.array(T.number), // [x1, y1, width, height]
});

export const SerializedFileRType = T.type({
  categories: T.array(SerializedCategoryRType),
  annotations: T.array(SerializedAnnotationRType),
});

//#endregion Basic Serialization Type

const toError = (errors: any) => {
  throw new Error(failure(errors).join("\n"));
};

export const validateFileType = (encodedFileContents: string) => {
  const annotations = JSON.parse(encodedFileContents);
  return getOrElseW(toError)(SerializedFileRType.decode(annotations));
};
