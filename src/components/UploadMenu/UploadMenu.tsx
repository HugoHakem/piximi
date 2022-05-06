import React from "react";
import { Menu } from "@mui/material";
import Fade from "@mui/material/Fade";
import ListItemIcon from "@mui/material/ListItemIcon";
import ComputerIcon from "@mui/icons-material/Computer";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import { DropboxMenuItem } from "./DropboxMenuItem";
import { StyledMenuItem } from "./StyledMenuItem";
import { ImageShapeDialog } from "../annotator/CategoriesList/OpenMenu/ImageShapeDialog";
import { applicationSlice } from "store/slices";
import { useDispatch } from "react-redux";
import { getImageShapeInformation, ImageShapeEnum } from "image/imageHelper";

type UploadMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: (event: any) => void;
  open: boolean;
};

export const UploadMenu = ({ anchorEl, onClose }: UploadMenuProps) => {
  const dispatch = useDispatch();

  const [openDimensionsDialogBox, setOpenDimensionsDialogBox] =
    React.useState(false);

  const handleClose = () => {
    setOpenDimensionsDialogBox(false);
  };

  const [files, setFiles] = React.useState<FileList>();

  const onUploadFromComputerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.currentTarget.files) return;

    const files: FileList = Object.assign([], event.currentTarget.files);

    const imageShapeInfo = await getImageShapeInformation(files[0]);

    if (imageShapeInfo !== ImageShapeEnum.hyperStackImage) {
      dispatch(
        applicationSlice.actions.uploadImages({
          files: files,
          channels: 3,
          slices: 1,
          imageShapeInfo: imageShapeInfo,
          isUploadedFromAnnotator: false,
        })
      );
    } else {
      setOpenDimensionsDialogBox(true);
    }

    event.target.value = "";
    setFiles(files);

    onClose(event);
  };

  return (
    <>
      <input
        accept="image/*"
        hidden
        type="file"
        multiple
        id="upload-images"
        onChange={onUploadFromComputerChange}
      />
      <Menu
        PaperProps={{ style: { width: 320 } }}
        TransitionComponent={Fade}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={onClose}
        open={Boolean(anchorEl)}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <ListSubheader
          sx={{
            color: "#80868b",
            margin: "16px",
            letterSpacing: ".07272727em",
            fontSize: ".6875rem",
            fontWeight: 500,
            lineHeight: "1rem",
            textTransform: "uppercase",
            maxWidth: 320,
          }}
        >
          Upload from
        </ListSubheader>

        <label htmlFor="upload-images">
          <StyledMenuItem component="span" dense onClick={onClose}>
            <ListItemIcon>
              <ComputerIcon />
            </ListItemIcon>
            <ListItemText primary="Computer" />
          </StyledMenuItem>
        </label>

        <DropboxMenuItem onClose={onClose} />
      </Menu>
      <ImageShapeDialog
        files={files!}
        open={openDimensionsDialogBox}
        onClose={handleClose}
        isUploadedFromAnnotator={false}
      />
    </>
  );
};
