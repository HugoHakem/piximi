import React, { useCallback, useEffect, useState } from "react";

import { List } from "@mui/material";

import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

import { useDialogHotkey, useHotkeys } from "hooks";

import { DialogWithAction } from "components/dialogs";

import { Category, HotkeyView, NEW_UNKNOWN_CATEGORY, Partition } from "types";
import { NewCategory } from "types/Category";
import { ShowPredictionItems } from "components/list-items";
import { CustomListItemButton } from "components/list-items/CustomListItemButton";
import { useDispatch, useSelector } from "react-redux";
import { selectCategoriesInView } from "store/slices/newData/selectors/selectors";
import { CategoryItemNew } from "components/list-items/CategoryItem/CategoryItemNew";
import { CategoryItemMenuNew } from "components/menus/CategoryItemMenu/CategoryItemMenuNew";
import {
  projectSlice,
  selectHighlightedImageCategory,
  selectSelectedImageIds,
} from "store/slices/project";
import {
  dataSlice,
  selectImageCategoryNames,
  selectImagesByCategoryDict,
  selectUnusedImageCategoryColors,
} from "store/slices/data";
import { selectActiveKind } from "store/slices/project/selectors";
import { CreateCategoryDialogNew } from "components/dialogs/CreateCategoryDialogNew/CreateCategoryDialogNew";
import { selectClassifierModelStatus } from "store/slices/classifier";
import { ModelStatus } from "types/ModelType";

// TODO: Make background different color (or find another way to differentiate list from section)
export const CategoriesListNew = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategoriesInView);
  const activeKind = useSelector(selectActiveKind);
  const [selectedCategory, setSelectedCategory] = useState<NewCategory>();
  const [categoryIndex, setCategoryIndex] = useState("");
  const imagesByCategory = useSelector(selectImagesByCategoryDict);

  const highlightedCategory = useSelector(selectHighlightedImageCategory);
  const unknownCategory = NEW_UNKNOWN_CATEGORY;
  const unavailableNames = useSelector(selectImageCategoryNames);
  const availableColors = useSelector(selectUnusedImageCategoryColors);
  const hasPredictions =
    useSelector(selectClassifierModelStatus) === ModelStatus.Suggesting;
  const hotkeysActive = true;
  const selectedImageIds = useSelector(selectSelectedImageIds);

  const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const {
    onClose: handleCloseCreateCategoryDialog,
    onOpen: handleOpenCreateCategoryDialog,
    open: isCreateCategoryDialogOpen,
  } = useDialogHotkey(HotkeyView.DialogWithAction);

  const {
    onClose: handleCloseDeleteCategoryDialog,
    onOpen: handleOpenDeleteCategoryDialog,
    open: isDeleteCategoryDialogOpen,
  } = useDialogHotkey(HotkeyView.DialogWithAction);

  const selectCategory = useCallback(
    (category: NewCategory) => {
      setSelectedCategory(category);

      dispatch(
        projectSlice.actions.updateHighlightedImageCategory({
          categoryId: category.id,
        })
      );
    },
    [dispatch]
  );

  const deleteCategories = useCallback(
    (categories: Category | Category[]) => {
      if (!Array.isArray(categories)) {
        categories = [categories];
      }

      dispatch(
        dataSlice.actions.deleteImageCategories({
          categoryIds: categories.map((category) => category.id),
          isPermanent: true,
        })
      );
    },
    [dispatch]
  );
  const deleteObjectsOfCategory = useCallback(
    (categoryId: string) => {
      const imageIds = imagesByCategory[categoryId];
      dispatch(
        dataSlice.actions.deleteImages({
          imageIds,
          disposeColorTensors: false,
          isPermanent: true,
        })
      );
    },
    [imagesByCategory, dispatch]
  );

  const onOpenCategoryMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    category: NewCategory
  ) => {
    selectCategory(category);
    setCategoryMenuAnchorEl(event.currentTarget);
  };

  const onCloseCategoryMenu = () => {
    setCategoryMenuAnchorEl(null);
  };
  const handleDeleteAllCategories = () => {};

  useHotkeys(
    "shift+1,shift+2,shift+3,shift+4,shift+5,shift+6,shift+7,shift+8,shift+9,shift+0",
    (event: any, _handler) => {
      if (!event.repeat) {
        setCategoryIndex((index) => {
          return index + _handler.key.at(-1)!.toString();
        });
      }
    },
    [HotkeyView.Annotator, HotkeyView.ProjectView],
    { enabled: hotkeysActive },
    []
  );

  useHotkeys(
    "shift+backspace",
    (event) => {
      if (!event.repeat) {
        setCategoryIndex((index) => {
          return index.slice(0, index.length - 1);
        });
      }
    },
    [HotkeyView.ProjectView],
    { enabled: hotkeysActive },
    []
  );

  useHotkeys(
    "shift",
    () => {
      if (selectedImageIds.length > 0) {
        dispatch(
          dataSlice.actions.updateImages({
            updates: selectedImageIds.map((imageId) => ({
              id: imageId,
              categoryId: highlightedCategory,
              partition: Partition.Unassigned,
            })),
            isPermanent: true,
          })
        );
      }

      setCategoryIndex("");
    },
    [HotkeyView.Annotator, HotkeyView.ProjectView],
    { keyup: true, enabled: hotkeysActive },
    [dispatch, selectedImageIds]
  );

  useEffect(() => {
    const allCategories = [NEW_UNKNOWN_CATEGORY, ...categories];
    if (categoryIndex.length === 0) {
      dispatch(
        projectSlice.actions.updateHighlightedImageCategory({
          categoryId: undefined,
        })
      );
    } else if (!Number.isNaN(+categoryIndex) && allCategories[+categoryIndex]) {
      dispatch(
        projectSlice.actions.updateHighlightedImageCategory({
          categoryId: allCategories[+categoryIndex].id,
        })
      );
    }
  }, [dispatch, categoryIndex, categories]);
  useEffect(() => {
    console.log(categories);
  });

  return (
    <>
      <List dense>
        <List dense sx={{ maxHeight: "20rem", overflowY: "scroll" }}>
          {categories.map((category: NewCategory) => {
            console.log(category);
            return (
              <CategoryItemNew
                category={category}
                key={category.id}
                isSelected={
                  selectedCategory
                    ? selectedCategory.id === category.id
                    : unknownCategory.id === category.id
                }
                selectCategory={selectCategory}
                isHighlighted={highlightedCategory === category.id}
                handleOpenCategoryMenu={onOpenCategoryMenu}
              />
            );
          })}
        </List>

        {
          hasPredictions && <ShowPredictionItems /> //TODO - UI: Should dissapear or be disabled?
        }
        <CustomListItemButton
          icon={<AddIcon />}
          primaryText="Create Category"
          onClick={handleOpenCreateCategoryDialog}
          dense
        />
        <CustomListItemButton
          icon={
            <DeleteIcon
              color={categories.length > 0 ? "inherit" : "disabled"}
            />
          }
          primaryText="Delete all categories"
          onClick={handleOpenDeleteCategoryDialog}
          dense
          disabled={categories.length === 0}
          tooltipText={
            categories.length === 0 ? "No user created categories" : undefined
          }
        />
      </List>

      <CategoryItemMenuNew
        anchorElCategoryMenu={categoryMenuAnchorEl}
        category={selectedCategory ?? unknownCategory}
        handleCloseCategoryMenu={onCloseCategoryMenu}
        usedCategoryColors={availableColors}
        usedCategoryNames={unavailableNames}
        dispatchDeleteObjectsOfCategory={deleteObjectsOfCategory}
        openCategoryMenu={Boolean(categoryMenuAnchorEl)}
        dispatchDeleteCategories={deleteCategories}
      />
      <CreateCategoryDialogNew
        kind={activeKind}
        onClose={handleCloseCreateCategoryDialog}
        open={isCreateCategoryDialogOpen}
      />

      <DialogWithAction
        title="Delete All Categories"
        content={`Affected objects will NOT be deleted, and instead be labelled as "Unknown"`}
        onConfirm={handleDeleteAllCategories}
        onClose={handleCloseDeleteCategoryDialog}
        isOpen={isDeleteCategoryDialogOpen}
      />
    </>
  );
};
