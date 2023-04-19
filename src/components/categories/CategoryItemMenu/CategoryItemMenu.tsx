import React from "react";

import { Divider, Menu, MenuList } from "@mui/material";

import { HideOrShowCategoryMenuItem } from "../HideOrShowCategoryMenuItem";
import { HideOtherCategoriesMenuItem } from "../HideOtherCategoriesMenuItem";

import { DeleteCategoryMenuItem } from "../DeleteCategory";
import { EditCategoryMenuItem } from "../EditCategory";
import { ClearAnnotationMenuItem } from "../ClearAnnotation";

import {
  Category,
  CategoryType,
  UNKNOWN_ANNOTATION_CATEGORY_ID,
  UNKNOWN_CLASS_CATEGORY_ID,
} from "types";
import { useDispatch } from "react-redux";
import { dataSlice } from "store/data";

type CategoryItemMenuProps = {
  anchorElCategoryMenu: any;
  category: Category;
  categoryType: CategoryType;
  onCloseCategoryMenu: () => void;
  onOpenCategoryMenu: (event: React.MouseEvent<HTMLButtonElement>) => void;
  openCategoryMenu: boolean;
};

export const CategoryItemMenu = ({
  anchorElCategoryMenu,
  category,
  categoryType,
  onCloseCategoryMenu,
  openCategoryMenu,
}: CategoryItemMenuProps) => {
  const dispatch = useDispatch();

  const hideOtherCategories = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    dispatch(
      dataSlice.actions.setOtherCategoriesInvisible({ id: category.id })
    );

    onCloseCategoryMenu();
  };
  const onHideCategory = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    const payload = {
      categoryId: category.id,
      visible: !category.visible,
    };

    dispatch(dataSlice.actions.setCategoryVisibility(payload));

    onCloseCategoryMenu();
  };
  return (
    <Menu
      anchorEl={anchorElCategoryMenu}
      anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      onClose={onCloseCategoryMenu}
      open={openCategoryMenu}
      transformOrigin={{ horizontal: "center", vertical: "top" }}
    >
      <MenuList dense variant="menu">
        <HideOtherCategoriesMenuItem
          handleHideOtherCategories={hideOtherCategories}
        />

        <HideOrShowCategoryMenuItem
          category={category}
          handleHideCategory={onHideCategory}
        />

        {category.id !== UNKNOWN_CLASS_CATEGORY_ID &&
          category.id !== UNKNOWN_ANNOTATION_CATEGORY_ID && (
            <div>
              <Divider />

              <DeleteCategoryMenuItem
                category={category}
                onCloseCategoryMenu={onCloseCategoryMenu}
              />

              <EditCategoryMenuItem
                category={category}
                categoryType={CategoryType.ClassifierCategory}
                onCloseCategoryMenu={onCloseCategoryMenu}
              />

              {categoryType === CategoryType.AnnotationCategory && (
                <ClearAnnotationMenuItem
                  category={category}
                  onCloseCategoryMenu={onCloseCategoryMenu}
                />
              )}
            </div>
          )}
      </MenuList>
    </Menu>
  );
};
