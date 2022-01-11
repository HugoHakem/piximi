import React, { ChangeEvent } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { ColorIcon } from "../../CategoriesList/ColorIcon";
import { useTranslation } from "hooks/useTranslation";

type CategoryDialogProps = {
  onCloseDialog: () => void;
  openDialog: boolean;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  action: string;
  onConfirm: () => void;
};

export const CategoryDialog = ({
  onCloseDialog,
  openDialog,
  onSubmit,
  title,
  color,
  setColor,
  name,
  setName,
  action,
  onConfirm,
}: CategoryDialogProps) => {
  const onColorChange = (color: any) => {
    setColor(color.hex);
  };

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const t = useTranslation();

  let dialogConfirm: JSX.Element;
  if (onSubmit) {
    dialogConfirm = (
      <Button onClick={onConfirm} color="primary" type="submit">
        {t(action)}
      </Button>
    );
  } else {
    dialogConfirm = (
      <Button onClick={onConfirm} color="primary">
        {t(action)}
      </Button>
    );
  }

  const dialogBody = (
    <>
      <DialogTitle>{t(title)}</DialogTitle>

      <DialogContent sx={{ paddingLeft: "0 !important" }}>
        <Box sx={{ margin: (theme) => theme.spacing(1) }}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <ColorIcon color={color} onColorChange={onColorChange} />
            </Grid>
            <Grid item xs={10}>
              <TextField
                autoFocus
                fullWidth
                id="name"
                label={t("Name")}
                margin="dense"
                onChange={onNameChange}
                value={name}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCloseDialog} color="primary">
          {t("Cancel")}
        </Button>

        {dialogConfirm}
      </DialogActions>
    </>
  );

  let dialogBodyWrap: JSX.Element;
  if (onSubmit) {
    dialogBodyWrap = (
      <form onSubmit={(event) => onSubmit(event)}>{dialogBody}</form>
    );
  } else {
    dialogBodyWrap = dialogBody;
  }

  return (
    <Dialog fullWidth onClose={onCloseDialog} open={openDialog}>
      {dialogBodyWrap}
    </Dialog>
  );
};
