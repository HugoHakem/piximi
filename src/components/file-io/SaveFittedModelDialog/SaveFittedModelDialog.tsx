import { ChangeEvent, useState } from "react";
import { LayersModel } from "@tensorflow/tfjs";
import { useHotkeys } from "hooks";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";

import { HotkeyView } from "types";
import { ModelTask } from "types/ModelType";

// TODO - segmenter: All of this
type SaveFittedModelDialogProps = {
  modelName: string;
  fittedModel: LayersModel | undefined;
  modelTask: ModelTask;
  onClose: () => void;
  open: boolean;
};

export const SaveFittedModelDialog = ({
  modelName,
  fittedModel,
  modelTask,
  onClose,
  open,
}: SaveFittedModelDialogProps) => {
  const [classifierName, setClassifierName] = useState<string>(modelName);

  const noFittedModel = fittedModel ? false : true;

  const onSaveClassifierClick = async () => {
    await fittedModel!.save(`downloads://${classifierName}`);

    onClose();
  };

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setClassifierName(event.target.value);
  };

  useHotkeys(
    "enter",
    () => {
      onSaveClassifierClick();
    },
    HotkeyView.SaveFittedModelDialog,
    { enableOnTags: ["INPUT"] },
    [onSaveClassifierClick]
  );

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle>Save {modelName}</DialogTitle>

      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <TextField
              autoFocus
              fullWidth
              id="name"
              label={modelName}
              margin="dense"
              onChange={onNameChange}
              helperText={
                noFittedModel
                  ? "There is no trained model that could be saved."
                  : ""
              }
              error={noFittedModel}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>

        <Button
          onClick={onSaveClassifierClick}
          color="primary"
          disabled={noFittedModel}
        >
          Save {modelName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};