import { createSelector } from "@reduxjs/toolkit";

import {
  selectStagedAnnotationIds,
  workingAnnotationIdSelector,
  selectActiveAnnotationIds,
  selectSelectedAnnotationIds,
} from "store/imageViewer";
import { annotationsAdapter } from "../dataSlice";
import { RootState } from "store/reducer/reducer";

import { DataStoreSlice, DecodedAnnotationType } from "types";

import { decodeAnnotation } from "utils/annotator";

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

export const selectAnnotationsByCategoryDict = ({
  data,
}: {
  data: DataStoreSlice;
}) => {
  return data.annotationsByCategory;
};

// TODO: O(NxM)
export const selectAnnotationCountByCategory = () =>
  createSelector(
    [
      selectAllAnnotationIds,
      selectAnnotationsByCategoryDict,
      (state, categoryId) => categoryId,
    ],
    (annotationIds, annotationsByCategory, categoryId) => {
      if (!Object.keys(annotationsByCategory).includes(categoryId)) return;
      let count = 0;
      for (const id of annotationsByCategory[categoryId]) {
        if (annotationIds.includes(id)) {
          count++;
        }
      }
      return count;
    }
  );

export const selectWorkingAnnotation = createSelector(
  [workingAnnotationIdSelector, selectAnnotationEntities],
  (annotationId, annotationEntities): DecodedAnnotationType | undefined => {
    if (!annotationId) return;
    return decodeAnnotation(annotationEntities[annotationId]!)!;
  }
);
export const selectStagedAnnotations = createSelector(
  [selectStagedAnnotationIds, selectAnnotationEntities],
  (annotationIds, annotationEntities): Array<DecodedAnnotationType> => {
    if (!annotationIds.length) return [];
    return annotationIds.map(
      (annotationId) => decodeAnnotation(annotationEntities[annotationId]!)!
    );
  }
);
export const selectActiveAnnotations = createSelector(
  [selectActiveAnnotationIds, selectAnnotationEntities],
  (annotationIds, annotationEntities): Array<DecodedAnnotationType> => {
    if (!annotationIds.length) return [];
    return annotationIds.map(
      (annotationId) => decodeAnnotation(annotationEntities[annotationId]!)!
    );
  }
);

export const selectActiveAnnotationIdsByCategory = createSelector(
  [selectActiveAnnotations, (_, categoryId) => categoryId],
  (activeAnnotations, categoryId) => {
    return activeAnnotations.reduce((ids: string[], annotation) => {
      if (annotation.categoryId === categoryId) {
        ids.push(annotation.id);
      }
      return ids;
    }, []);
  }
);

export const selectSelectedAnnotations = createSelector(
  [
    selectSelectedAnnotationIds,
    workingAnnotationIdSelector,
    selectAnnotationEntities,
  ],
  (
    selectedIds,
    workingId,
    annotationEntities
  ): Array<DecodedAnnotationType> => {
    if (!workingId)
      return selectedIds.map(
        (annotationId) => decodeAnnotation(annotationEntities[annotationId]!)!
      );
    return [...selectedIds, workingId].map(
      (annotationId) => decodeAnnotation(annotationEntities[annotationId]!)!
    );
  }
);