import { createSelector } from "@reduxjs/toolkit";

import { annotationsAdapter } from "../../dataSlice";
import { RootState } from "store/reducer/reducer";

import { DataStoreSlice, AnnotationType } from "types";

const annotationSelectors = annotationsAdapter.getSelectors(
  (state: RootState) => state.data.annotations
);

export const selectAnnotationEntities = annotationSelectors.selectEntities;
export const selectAllAnnotations = annotationSelectors.selectAll;
export const selectAllAnnotationIds = annotationSelectors.selectIds;
export const selectAnnotationById = annotationSelectors.selectEntities;
export const selectTotalAnnotationCount = annotationSelectors.selectTotal;

export const selectAnnotationsByImageDict = ({
  data,
}: {
  data: DataStoreSlice;
}) => {
  return data.annotationsByImage;
};

export const selectAnnotationsByCategoryDict = ({
  data,
}: {
  data: DataStoreSlice;
}) => {
  return data.annotationsByCategory;
};

export const selectAnnotationIdsByImage = createSelector(
  [selectAnnotationsByImageDict, (state, imageId: string) => imageId],
  (annotationsByImage, imageId) => {
    return annotationsByImage[imageId];
  }
);

export const selectTotalAnnotationCountByImage = createSelector(
  [
    selectAnnotationsByImageDict,
    selectAllAnnotationIds,
    (state, imageId) => imageId,
  ],
  (annotationsByImage, annotationIds, imageId) => {
    let count = 0;

    for (const id of annotationsByImage[imageId]) {
      if (annotationIds.includes(id)) {
        count++;
      }
    }

    return count;
  }
);

export const selectAnnotationCountByCategory = () =>
  createSelector(
    [
      selectAllAnnotationIds,
      selectAnnotationsByCategoryDict,
      (state, categoryId) => categoryId,
    ],
    (annotationIds, annotationsByCategory, categoryId) => {
      if (!Object.keys(annotationsByCategory).includes(categoryId)) return;

      return annotationsByCategory[categoryId].length;
    }
  );

export const selectAnnotationsByImage = createSelector(
  [selectAnnotationsByImageDict, selectAnnotationEntities],
  (idsByImage, entities): ((imageId: string) => AnnotationType[]) =>
    (imageId: string) => {
      const ids = idsByImage[imageId];
      if (!ids) return [];
      const annotations = ids.map((id) => entities[id]);
      return annotations;
    }
);