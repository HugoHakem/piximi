import { createSelector } from "@reduxjs/toolkit";
import { ImageViewerStore } from "types";

export const selectActiveAnnotationIds = ({
  imageViewer,
}: {
  imageViewer: ImageViewerStore;
}): string[] => {
  return imageViewer.activeAnnotationIds;
};

export const selectActiveAnnotationIdsCount = createSelector(
  selectActiveAnnotationIds,
  (activeIds): number => {
    return activeIds.length;
  }
);
