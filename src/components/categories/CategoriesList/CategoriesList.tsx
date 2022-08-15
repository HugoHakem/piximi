import React, { useEffect } from "react";

import { CategoryListItem } from "../CategoryListItem";
import { CreateCategoryListItem } from "../CreateCategoryListItem";

import { PredictionVisibility } from "../PredictionsVisibility/";
import { DeleteAllCategoriesMenuItem } from "../DeleteAllCategoriesMenuItem";

import { CollapsibleList } from "components/common/CollapsibleList";

import { Category, CategoryType } from "types";

type CategoriesListProps = {
  createdCategories: Array<Category>;
  categoryType: CategoryType;
  unknownCategory: Category;
  predicted: boolean;
  onCategoryClickCallBack: (category: Category) => void;
};

export const CategoriesList = (props: CategoriesListProps) => {
  const {
    createdCategories: categories,
    categoryType,
    unknownCategory,
    predicted,
    onCategoryClickCallBack,
  } = props;

  const [showPredictionVisibilityMenu, setShowPredictionVisibilityMenu] =
    React.useState<boolean>(true);

  const [showDeleteAllCategoriesIcon, setShowDeleteAllCategoriesIcon] =
    React.useState<boolean>(true);

  useEffect(() => {
    setShowPredictionVisibilityMenu(predicted);
  }, [predicted]);

  useEffect(() => {
    setShowDeleteAllCategoriesIcon(categories.length > 0);
  }, [categories]);

  return (
    <CollapsibleList dense primary="Categories">
      <CategoryListItem
        categoryType={categoryType}
        category={unknownCategory}
        key={unknownCategory.id}
        id={unknownCategory.id}
        onCategoryClickCallBack={onCategoryClickCallBack}
      />
      {categories.map((category: Category) => {
        return (
          <CategoryListItem
            categoryType={categoryType}
            category={category}
            key={category.id}
            id={category.id}
            onCategoryClickCallBack={onCategoryClickCallBack}
          />
        );
      })}

      {showPredictionVisibilityMenu && <PredictionVisibility />}

      <CreateCategoryListItem categoryType={categoryType} />

      {showDeleteAllCategoriesIcon && (
        <DeleteAllCategoriesMenuItem categoryType={categoryType} />
      )}
    </CollapsibleList>
  );
};