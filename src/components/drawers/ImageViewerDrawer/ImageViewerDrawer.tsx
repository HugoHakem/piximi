import React from "react";
import { useSelector } from "react-redux";

import { Divider, Drawer, List } from "@mui/material";

import {
  CategoriesList,
  ImageList,
  ClearAnnotationsGroup,
} from "components/lists";
import { AppBarOffset } from "components/styled-components";
import { ApplicationOptionsList } from "components/lists/ApplicationOptionsList";

import { OpenImageListItem, SaveImageListItem } from "components/list-items";
import { ImageViewerAppBar } from "components/app-bars";

import {
  selectCreatedAnnotationCategories,
  selectSelectedImages,
} from "store/data";

import { CategoryType } from "types/Category";

export const ImageViewerDrawer = () => {
  const createdCategories = useSelector(selectCreatedAnnotationCategories);

  const annotatorImages = useSelector(selectSelectedImages);

  return (
    <Drawer
      anchor="left"
      sx={{
        flexShrink: 0,
        width: (theme) => theme.spacing(32),
        "& > .MuiDrawer-paper": {
          width: (theme) => theme.spacing(32),
        },
      }}
      open
      variant="persistent"
    >
      <ImageViewerAppBar />

      <AppBarOffset />

      <Divider />

      <List dense>
        <OpenImageListItem />
        <SaveImageListItem />
      </List>

      <Divider />

      <ImageList images={annotatorImages} />

      <Divider />

      <CategoriesList
        createdCategories={createdCategories}
        categoryType={CategoryType.AnnotationCategory}
      />

      <Divider />

      <ClearAnnotationsGroup />

      <Divider />

      <ApplicationOptionsList />
    </Drawer>
  );
};