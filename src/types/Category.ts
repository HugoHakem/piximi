import {
  UNKNOWN_ANNOTATION_CATEGORY_COLOR,
  UNKNOWN_CLASS_CATEGORY_COLOR,
} from "utils/common/colorPalette";

export type Category = {
  color: string; // 3 byte hex, eg. "#a08cd2"
  id: string;
  name: string;
  visible: boolean;
};

export enum CategoryType {
  ClassifierCategory,
  AnnotationCategory,
}

export const UNKNOWN_CLASS_CATEGORY_ID: string =
  "00000000-0000-0000-0000-000000000000";

export const UNKNOWN_CLASS_CATEGORY: Category = {
  color: UNKNOWN_CLASS_CATEGORY_COLOR,
  id: UNKNOWN_CLASS_CATEGORY_ID,
  name: "Unknown",
  visible: true,
};

export const UNKNOWN_ANNOTATION_CATEGORY_ID: string =
  "00000000-0000-1111-0000-000000000000";

export const UNKNOWN_ANNOTATION_CATEGORY: Category = {
  color: UNKNOWN_ANNOTATION_CATEGORY_COLOR,
  id: UNKNOWN_ANNOTATION_CATEGORY_ID,
  name: "Unknown",
  visible: true,
};
