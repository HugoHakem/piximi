import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from "@mui/material";

import { useTranslation } from "hooks";

import { Label as LabelIcon } from "@mui/icons-material";

import { CollapsibleList } from "components/common/CollapsibleList";

import { imageViewerSlice } from "store/imageViewer";
import { selectAllAnnotationCategories } from "store/data";

import { Category } from "types";

import { ReactComponent as InvertSelectionIcon } from "icons/InvertAnnotation.svg";
import { selectActiveAnnotations } from "store/data/selectors/annotationSelectors";

export const PointerSelectionOptions = () => {
  const t = useTranslation();

  const dispatch = useDispatch();

  const activeAnnotations = useSelector(selectActiveAnnotations);
  const annotationCategories = useSelector(selectAllAnnotationCategories);

  const onSelectAll = () => {
    dispatch(imageViewerSlice.actions.setAllSelectedAnnotationIds({}));
  };

  const onSelectNone = () => {
    dispatch(
      imageViewerSlice.actions.setSelectedAnnotationIds({
        selectedAnnotationIds: [],
        workingAnnotationId: undefined,
      })
    );
  };

  const onSelectCategory = (
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLDivElement>,
    categoryId: string
  ) => {
    const desiredAnnotationIds = activeAnnotations.reduce(
      (ids: string[], annotation) => {
        if (annotation.categoryId === categoryId) {
          ids.push(annotation.id);
        }
        return ids;
      },
      []
    );
    dispatch(
      imageViewerSlice.actions.setSelectedAnnotationIds({
        selectedAnnotationIds: desiredAnnotationIds,
        workingAnnotationId: desiredAnnotationIds[0],
      })
    );
  };

  return (
    <>
      <Divider />

      <List>
        <ListItem button onClick={onSelectAll} dense>
          <ListItemIcon>
            <SvgIcon>
              <InvertSelectionIcon />
            </SvgIcon>
          </ListItemIcon>

          <ListItemText primary={t("Select all")} />
        </ListItem>
        <ListItem button onClick={onSelectNone} dense>
          <ListItemIcon>
            <SvgIcon>
              <InvertSelectionIcon />
            </SvgIcon>
          </ListItemIcon>

          <ListItemText primary={t("Select none")} />
        </ListItem>
      </List>

      <Divider />
      <CollapsibleList closed dense primary={t("Select by Category")}>
        {annotationCategories.map((category: Category, idx: number) => {
          return (
            <ListItem
              button
              id={category.id}
              onClick={(event) => onSelectCategory(event, category.id)}
              key={idx}
            >
              <ListItemIcon>
                <LabelIcon style={{ color: category.color }} />
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItem>
          );
        })}
      </CollapsibleList>
    </>
  );
};
