import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Project } from "types/Project";
import { defaultImageSortKey, ImageSortKey } from "types/ImageSortType";
import { mutatingFilter } from "utils/common/helpers";

export const initialState: Project = {
  selectedImageIds: [],
  name: "Untitled project",
  imageSortKey: defaultImageSortKey.imageSortKey,
  highlightedCategory: null,
  hiddenImageCategoryIds: [],
};

export const projectSlice = createSlice({
  name: "project",
  initialState: initialState,
  reducers: {
    resetProject: () => initialState,
    clearSelectedImages(state) {
      state.selectedImageIds = [];
    },
    deselectImage(state, action: PayloadAction<{ id: string }>) {
      state.selectedImageIds = state.selectedImageIds.filter(
        (id: string) => id !== action.payload.id
      );
    },
    deselectImages(state, action: PayloadAction<{ ids: Array<string> }>) {
      state.selectedImageIds = state.selectedImageIds.filter(
        (id: string) => !action.payload.ids.includes(id)
      );
    },
    selectAllImages(state, action: PayloadAction<{ ids: Array<string> }>) {
      state.selectedImageIds = [];

      state.selectedImageIds = action.payload.ids;
    },
    selectImage(state, action: PayloadAction<{ imageId: string }>) {
      state.selectedImageIds.push(action.payload.imageId);
    },
    selectImages(state, action: PayloadAction<{ imageIds: Array<string> }>) {
      for (const imageId of action.payload.imageIds) {
        projectSlice.caseReducers.selectImage(state, {
          type: "selectImage",
          payload: { imageId },
        });
      }
    },
    setselectedImages(
      state,
      action: PayloadAction<{ imageIds: Array<string> }>
    ) {
      state.selectedImageIds = [];

      projectSlice.caseReducers.selectImages(state, {
        type: "selectImages",
        payload: { imageIds: action.payload.imageIds },
      });
    },
    hideCategory(
      state,
      action: PayloadAction<{
        categoryId: string;
      }>
    ) {
      !state.hiddenImageCategoryIds.includes(action.payload.categoryId) &&
        state.hiddenImageCategoryIds.push(action.payload.categoryId);
    },
    hideCategories(
      state,
      action: PayloadAction<{
        categoryIds: string[];
      }>
    ) {
      for (const categoryId of action.payload.categoryIds) {
        projectSlice.caseReducers.hideCategory(state, {
          type: "hideCategory",
          payload: { categoryId },
        });
      }
    },
    showCategory(
      state,
      action: PayloadAction<{
        categoryId: string;
      }>
    ) {
      mutatingFilter(
        state.hiddenImageCategoryIds,
        (categoryId) => categoryId !== action.payload.categoryId
      );
    },
    showCategories(
      state,
      action: PayloadAction<{
        categoryIds: string[];
      }>
    ) {
      for (const categoryId of action.payload.categoryIds) {
        projectSlice.caseReducers.showCategory(state, {
          type: "showCategory",
          payload: { categoryId },
        });
      }
    },
    showAllCategories(state, action: PayloadAction<{}>) {
      state.hiddenImageCategoryIds = [];
    },
    toggleCategoryVisibility(
      state,
      action: PayloadAction<{
        categoryId: string;
      }>
    ) {
      const { categoryId } = action.payload;

      if (state.hiddenImageCategoryIds.includes(categoryId)) {
        mutatingFilter(
          state.hiddenImageCategoryIds,
          (id) => id !== action.payload.categoryId
        );
      } else {
        state.hiddenImageCategoryIds.push(categoryId);
      }
    },

    createNewProject(state, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
      state.imageSortKey = defaultImageSortKey.imageSortKey;
    },
    setProject(state, action: PayloadAction<{ project: Project }>) {
      // WARNING, don't do below (overwrites draft object)
      // state = action.payload.project;
      return action.payload.project;
    },
    sortImagesBySelectedKey(
      state,
      action: PayloadAction<{ imageSortKey: ImageSortKey }>
    ) {
      const selectedSortKey = action.payload.imageSortKey;
      state.imageSortKey = selectedSortKey;

      //(state.images as OldImageType[]).sort(selectedSortKey.comparerFunction);
    },
    setProjectName(state, action: PayloadAction<{ name: string }>) {
      state.name = action.payload.name;
    },
    updateHighlightedCategory(
      state,
      action: PayloadAction<{ categoryIndex: number }>
    ) {
      // const index = action.payload.categoryIndex;
      // if (!isNaN(index) && index < state.categories.length) {
      //   const categoryId = state.categories[action.payload.categoryIndex].id;
      //   state.highlightedCategory = categoryId;
      // } else {
      //   state.highlightedCategory = null;
      // }
    },
  },
});

export const {
  createNewProject,
  selectImage,
  selectImages,
  selectAllImages,
  setselectedImages,
  deselectImage,
  deselectImages,
  updateHighlightedCategory,
} = projectSlice.actions;
