import React, { useCallback } from "react";
import { ApplicationDrawer } from "../ApplicationDrawer";
import { ImageGrid } from "../ImageGrid";
import { ApplicationAppBar } from "../ApplicationAppBar";
import { Box, CssBaseline } from "@mui/material";
import { ImageShapeDialog } from "../annotator/CategoriesList/OpenMenu/ImageShapeDialog";
import { applicationSlice } from "store/slices/applicationSlice";
import { useHotkeys } from "react-hotkeys-hook";
import { useDispatch, useSelector } from "react-redux";
import { visibleImagesSelector } from "store/selectors";
import { Image } from "../../types/Image";

export const MainView = () => {
  const dispatch = useDispatch();

  const [openDimensionsDialogBox, setOpenDimensionsDialogBox] =
    React.useState(false);

  const handleClose = () => {
    setOpenDimensionsDialogBox(false);
  };

  const [files, setFiles] = React.useState<FileList>();

  const onUnload = (e: any) => {
    if (process.env.NODE_ENV === "development") {
      return;
    } else {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to exit?");
    }
  };

  React.useEffect(() => {
    window.addEventListener("beforeunload", onUnload);
    return () => {
      window.removeEventListener("beforeunload", onUnload);
    };
  }, []);

  const onDrop = useCallback(async (item) => {
    if (item) {
      setFiles(item.files);
      setOpenDimensionsDialogBox(true); //open dialog box
    }
  }, []);

  const images = useSelector(visibleImagesSelector);
  const selectAllImages = () => {
    const newSelected = images.map((image: Image) => image.id);
    dispatch(applicationSlice.actions.selectAllImages({ ids: newSelected }));
  };

  const selectAllImagesHotkeyRef = useHotkeys(
    "control+a",
    () => selectAllImages(),
    [images]
  ) as React.MutableRefObject<HTMLDivElement>;

  return (
    <div ref={selectAllImagesHotkeyRef} tabIndex={-1}>
      <Box sx={{ height: "100vh" }}>
        <CssBaseline />

        <ApplicationAppBar />

        <ApplicationDrawer />

        <ImageGrid onDrop={onDrop} />

        <ImageShapeDialog
          files={files!}
          open={openDimensionsDialogBox}
          onClose={handleClose}
          isUploadedFromAnnotator={false}
        />
      </Box>
    </div>
  );
};
