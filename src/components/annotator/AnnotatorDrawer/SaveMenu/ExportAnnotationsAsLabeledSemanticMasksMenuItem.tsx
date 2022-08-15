import React from "react";
import { useSelector } from "react-redux";
import JSZip from "jszip";

import { MenuItem, ListItemText } from "@mui/material";

import {
  annotationCategoriesSelector,
  annotatorImagesSelector,
} from "store/selectors";

import { saveAnnotationsAsLabeledSemanticSegmentationMasks } from "image/imageHelper";

type SaveAnnotationsMenuItemProps = {
  popupState: any;
  handleCloseMenu: () => void;
};

export const ExportAnnotationsAsLabeledSemanticMasksMenuItem = ({
  popupState,
  handleCloseMenu,
}: SaveAnnotationsMenuItemProps) => {
  const images = useSelector(annotatorImagesSelector);
  const annotationCategories = useSelector(annotationCategoriesSelector);

  const onExport = () => {
    popupState.close();
    handleCloseMenu();

    let zip = new JSZip();

    saveAnnotationsAsLabeledSemanticSegmentationMasks(
      images,
      annotationCategories,
      zip
    );
  };

  return (
    <MenuItem onClick={onExport}>
      <ListItemText primary="Labeled semantic masks" />
    </MenuItem>
  );
};