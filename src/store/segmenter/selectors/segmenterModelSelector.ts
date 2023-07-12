import { SegmenterStoreType } from "types";
import { availableSegmenterModels } from "types/ModelType";

export const segmenterModelSelector = ({
  segmenter,
}: {
  segmenter: SegmenterStoreType;
}) => {
  return availableSegmenterModels[segmenter.selectedModelIdx];
};
