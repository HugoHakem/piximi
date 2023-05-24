import { useCallback, useMemo, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";

import {
  dataSlice,
  selectImageCategoryNames,
  selectImagesByCategoryDict,
  selectUsedImageCategoryColors,
  selectActiveAnnotationCountsByCategory,
  selectAnnotationsByCategoryDict,
} from "store/data";

import {
  imageViewerSlice,
  selectHiddenAnnotationCategoryIds,
} from "store/imageViewer";

import { projectSlice, selectHiddenImageCategoryIds } from "store/project";

import {
  Category,
  CategoryType,
  PartialBy,
  UNKNOWN_ANNOTATION_CATEGORY,
  UNKNOWN_CLASS_CATEGORY,
} from "types";

export const useCategoryHandlers = (
  categoryType: CategoryType,
  categories: Category[]
) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const hiddenAnnotationCategories = useSelector(
    selectHiddenAnnotationCategoryIds
  );
  const hiddenImageCategories = useSelector(selectHiddenImageCategoryIds);
  const imagesByCategories = useSelector(selectImagesByCategoryDict);
  const annotationsByCategory = useSelector(selectAnnotationsByCategoryDict);
  const usedImageCategoryNames = useSelector(selectImageCategoryNames);
  const usedImageCategoryColors = useSelector(selectUsedImageCategoryColors);
  const activeAnnotationCountsByCategory = useSelector(
    selectActiveAnnotationCountsByCategory
  );

  //TODO - categories: Figure out uses of selected in store

  const handleSelectCategory = useCallback(
    (category: Category) => {
      setSelectedCategory(category);

      if (categoryType === CategoryType.ImageCategory) {
        console.log(category);
        dispatch(
          projectSlice.actions.updateHighlightedCategory({
            categoryIndex: 0,
          })
        );
      } else {
        dispatch(
          imageViewerSlice.actions.setSelectedCategoryId({
            selectedCategoryId: category.id,
            execSaga: true,
          })
        );
      }
    },
    [categoryType, dispatch]
  );

  const handleToggleCategoryVisibility = useCallback(
    (category: Category) => {
      if (categoryType === CategoryType.ImageCategory) {
        dispatch(
          projectSlice.actions.toggleCategoryVisibility({
            categoryId: category.id,
          })
        );
      } else {
        dispatch(
          imageViewerSlice.actions.toggleCategoryVisibility({
            categoryId: category.id,
          })
        );
      }
    },
    [categoryType, dispatch]
  );

  const handleHideOtherCategories = useCallback(
    (category?: Category) => {
      let otherCategories: string[];
      if (categoryType === CategoryType.ImageCategory) {
        otherCategories = [...categories, UNKNOWN_CLASS_CATEGORY].reduce(
          (otherIds: string[], otherCategory: Category) => {
            if (!category || otherCategory.id !== category.id) {
              otherIds.push(otherCategory.id);
            }
            return otherIds;
          },
          []
        );
        dispatch(
          projectSlice.actions.hideCategories({
            categoryIds: otherCategories,
          })
        );
      } else {
        otherCategories = [...categories, UNKNOWN_ANNOTATION_CATEGORY].reduce(
          (otherIds: string[], otherCategory: Category) => {
            if (!category || otherCategory.id !== category.id) {
              otherIds.push(otherCategory.id);
            }
            return otherIds;
          },
          []
        );
        dispatch(
          imageViewerSlice.actions.hideCategories({
            categoryIds: otherCategories,
          })
        );
      }
    },
    [categories, categoryType, dispatch]
  );

  const handleShowAllCategories = useCallback(() => {
    if (categoryType === CategoryType.ImageCategory) {
      dispatch(projectSlice.actions.showCategories({}));
    } else {
      dispatch(imageViewerSlice.actions.showCategories({}));
    }
  }, [categoryType, dispatch]);

  const imageCategoryIsVisible = useCallback(
    (categoryId: string) => {
      return !hiddenImageCategories.includes(categoryId);
    },
    [hiddenImageCategories]
  );

  const annotationCategoryIsVisible = useCallback(
    (categoryId: string) => {
      return !hiddenAnnotationCategories.includes(categoryId);
    },
    [hiddenAnnotationCategories]
  );

  const hasHiddenImageCategories = useMemo(() => {
    return hiddenImageCategories.length > 0;
  }, [hiddenImageCategories]);

  const hasHiddenAnnotationCategories = useMemo(() => {
    return hiddenAnnotationCategories.length > 0;
  }, [hiddenAnnotationCategories]);

  const ImageCountByCategory = useCallback(
    (categoryId: string): number => {
      return imagesByCategories[categoryId].length ?? 0;
    },
    [imagesByCategories]
  );
  const annotationCountByCategory = useCallback(
    (categoryId: string): number => {
      return activeAnnotationCountsByCategory[categoryId] ?? 0;
    },
    [activeAnnotationCountsByCategory]
  );

  const dispatchDeleteCategories = useCallback(
    (categories: Category | Category[]) => {
      if (!Array.isArray(categories)) {
        categories = [categories];
      }

      if (categoryType === CategoryType.ImageCategory) {
        dispatch(
          dataSlice.actions.deleteImageCategories({
            categoryIds: categories.map((category) => category.id),
          })
        );
      } else {
        batch(() => {
          dispatch(
            imageViewerSlice.actions.setSelectedCategoryId({
              selectedCategoryId: UNKNOWN_ANNOTATION_CATEGORY.id,
              execSaga: true,
            })
          );

          dispatch(
            dataSlice.actions.deleteAnnotationCategories({
              categoryIds: (categories as Category[]).map(
                (category) => category.id
              ), //TODO - syntax: Why need to explicitly give type here but not for Classifier Category
            })
          );
        });
      }
    },
    [categoryType, dispatch]
  );

  const dispatchDeleteImagesOfCategory = useCallback(
    (categoryId: string) => {
      const imageIds = imagesByCategories[categoryId];
      dispatch(
        dataSlice.actions.deleteImages({ imageIds, disposeColorTensors: false })
      );
    },
    [imagesByCategories, dispatch]
  );

  const dispatchDeleteAnnotationsOfCategory = useCallback(
    (categoryId: string) => {
      const annotationIds = annotationsByCategory[categoryId];
      dispatch(dataSlice.actions.deleteAnnotations({ annotationIds }));
    },
    [annotationsByCategory, dispatch]
  );

  const dispatchUpsertCategory = useCallback(
    (category: PartialBy<Category, "id" | "visible">) => {
      if (categoryType === CategoryType.ImageCategory) {
        dispatch(dataSlice.actions.upsertImageCategory({ category }));
      } else {
        dispatch(dataSlice.actions.upsertAnnotationCategory({ category }));
      }
    },
    [categoryType, dispatch]
  );

  if (categoryType === CategoryType.ImageCategory) {
    return {
      selectedCategory,
      dispatchDeleteCategories,
      dispatchUpsertCategory,
      handleSelectCategory,
      handleToggleCategoryVisibility,
      handleHideOtherCategories,
      handleShowAllCategories,
      categoryIsVisible: imageCategoryIsVisible,
      hasHidden: hasHiddenImageCategories,
      objectCountByCategory: ImageCountByCategory,
      dispatchDeleteObjectsOfCategory: dispatchDeleteImagesOfCategory,
      usedCategoryInfo: {
        names: usedImageCategoryNames,
        colors: usedImageCategoryColors,
      },
      unknownCategory: UNKNOWN_CLASS_CATEGORY,
    };
  } else {
    return {
      selectedCategory,
      dispatchDeleteCategories,
      dispatchUpsertCategory,
      handleSelectCategory,
      handleToggleCategoryVisibility,
      handleHideOtherCategories,
      handleShowAllCategories,
      categoryIsVisible: annotationCategoryIsVisible,
      hasHidden: hasHiddenAnnotationCategories,
      objectCountByCategory: annotationCountByCategory,
      dispatchDeleteObjectsOfCategory: dispatchDeleteAnnotationsOfCategory,
      usedCategoryInfo: {
        names: usedImageCategoryNames,
        colors: usedImageCategoryColors,
      },
      unknownCategory: UNKNOWN_ANNOTATION_CATEGORY,
    };
  }
};
