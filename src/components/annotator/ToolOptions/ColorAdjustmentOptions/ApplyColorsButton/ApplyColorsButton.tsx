import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { activeImageColorsSelector } from "../../../../../store/selectors/activeImageColorsSelector";
import { imageViewerSlice } from "../../../../../store/slices";
import {
  convertImageURIsToImageData,
  mapChannelstoSpecifiedRGBImage,
} from "../../../../../image/imageHelper";
import { imageViewerFullImagesSelector } from "../../../../../store/selectors";
import { activeImageIdSelector } from "../../../../../store/selectors/activeImageIdSelector";
import { ImageType } from "../../../../../types/ImageType";
import { activeImagePlaneSelector } from "../../../../../store/selectors/activeImagePlaneSelector";

export const ApplyColorsButton = () => {
  const activeImageColors = useSelector(activeImageColorsSelector);
  const dispatch = useDispatch();
  const images = useSelector(imageViewerFullImagesSelector);
  const activeImageId = useSelector(activeImageIdSelector);
  const activeImagePlane = useSelector(activeImagePlaneSelector);

  const onApplyColorsClick = () => {
    dispatch(
      imageViewerSlice.actions.setCurrentColors({
        currentColors: activeImageColors,
      })
    );

    const getUpdatedImages = async (): Promise<Array<ImageType>> => {
      return Promise.all(
        images.map(async (image: ImageType) => {
          if (image.id === activeImageId) {
            return image; //don't do anything, the imageSrc has already been updated on slider change / toggling
          }

          if (image.shape.channels !== activeImageColors.length) {
            //if mismatch between image size and desired colors, don't do anything on the image
            return image;
          }

          const originalData = await convertImageURIsToImageData(
            new Array(image.originalSrc[activeImagePlane])
          );

          const modifiedURI = mapChannelstoSpecifiedRGBImage(
            originalData[0],
            activeImageColors,
            image.shape.height,
            image.shape.width
          );

          return { ...image, colors: activeImageColors, src: modifiedURI };
        })
      );
    };

    getUpdatedImages().then((updatedImages: Array<ImageType>) => {
      dispatch(imageViewerSlice.actions.setImages({ images: updatedImages }));
    });
  };

  return (
    <ListItem button onClick={onApplyColorsClick}>
      <ListItemText>{"Apply to all images open in annotator"}</ListItemText>
    </ListItem>
  );
};
