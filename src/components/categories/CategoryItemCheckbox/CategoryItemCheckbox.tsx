import { useDispatch, useSelector } from "react-redux";

import { Checkbox, ListItemIcon } from "@mui/material";
import {
  Label as LabelIcon,
  LabelOutlined as LabelOutlinedIcon,
} from "@mui/icons-material";

import { deselectImages } from "store/project";

import { dataSlice, selectImagesByCategory } from "store/data";

import { Category } from "types";
import { useMemo } from "react";

type CategoryItemCheckboxProps = {
  category: Category;
};

export const CategoryItemCheckbox = ({
  category,
}: CategoryItemCheckboxProps) => {
  const dispatch = useDispatch();

  const memoizedSelectImagesByCategory = useMemo(selectImagesByCategory, []);
  const categoryImages = useSelector((state) =>
    memoizedSelectImagesByCategory(state, category.id)
  );

  const onHideCategory = () => {
    const payload = {
      categoryId: category.id,
      visible: !category.visible,
    };

    if (category.visible) {
      dispatch(
        deselectImages({
          ids: categoryImages,
        })
      );
    }

    dispatch(dataSlice.actions.setCategoryVisibility(payload));
  };

  return (
    <ListItemIcon>
      <Checkbox
        checked={category.visible}
        checkedIcon={<LabelIcon style={{ color: category.color }} />}
        disableRipple
        edge="start"
        icon={<LabelOutlinedIcon style={{ color: category.color }} />}
        tabIndex={-1}
        onChange={onHideCategory}
      />
    </ListItemIcon>
  );
};
