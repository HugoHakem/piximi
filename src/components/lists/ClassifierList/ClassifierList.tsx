import React, { useEffect } from "react";

import { Box } from "@mui/material";

import { useDialog, useDialogHotkey } from "hooks";

import { ImportTensorflowModelDialog } from "components/dialogs";
import {
  SaveFittedModelDialog,
  EvaluateClassifierDialog,
  FitClassifierDialog,
} from "components/dialogs";

import { ModelExecButtonGroup } from "components/list-items/ClassifierExecListItem/ModelExecButtonGroup";

import { ModelIOButtonGroup } from "components/list-items/ModelIOButtonGroup/ModelIOButtonGroup";
import { useClassificationModel } from "hooks/useLearningModel/useClassifierModel";
import { HotkeyContext } from "utils/common/enums";
import { ModelStatus, ModelTask } from "utils/models/enums";

export const ClassifierList = () => {
  const {
    modelStatus,
    selectedModel,
    handlePredict,
    handleEvaluate,
    helperText,
    waitingForResults,
    setWaitingForResults,
    handleImportModel,
  } = useClassificationModel();
  const {
    onClose: handleCloseEvaluateClassifierDialog,
    onOpen: handleOpenEvaluateClassifierDialog,
    open: evaluateClassifierDialogOpen,
  } = useDialog();

  const {
    onClose: handleCloseImportClassifierDialog,
    onOpen: handleOpenImportClassifierDialog,
    open: ImportClassifierDialogOpen,
  } = useDialogHotkey(HotkeyContext.ConfirmationDialog);
  const {
    onClose: handleCloseSaveClassifierDialog,
    onOpen: handleOpenSaveClassifierDialog,
    open: SaveClassifierDialogOpen,
  } = useDialog();
  const {
    onClose: handleCloseFitClassifierDialog,
    onOpen: handleOpenFitClassifierDialog,
    open: fitClassifierDialogOpen,
  } = useDialogHotkey(HotkeyContext.ClassifierDialog, false);

  useEffect(() => {
    if (modelStatus === ModelStatus.Trained && waitingForResults) {
      setWaitingForResults(false);
      handleOpenEvaluateClassifierDialog();
    }
  }, [
    modelStatus,
    waitingForResults,
    handleOpenEvaluateClassifierDialog,
    setWaitingForResults,
  ]);

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        <ModelIOButtonGroup
          handleImportModel={handleOpenImportClassifierDialog}
          handleSaveModel={handleOpenSaveClassifierDialog}
        />

        <ModelExecButtonGroup
          modelStatus={modelStatus}
          handleEvaluate={handleEvaluate}
          handleFit={handleOpenFitClassifierDialog}
          handlePredict={handlePredict}
          modelTrainable={selectedModel.trainable}
          helperText={helperText}
        />
      </Box>
      <ImportTensorflowModelDialog
        onClose={handleCloseImportClassifierDialog}
        open={ImportClassifierDialogOpen}
        modelTask={ModelTask.Classification}
        dispatchFunction={handleImportModel}
      />
      <SaveFittedModelDialog
        model={selectedModel}
        modelStatus={modelStatus}
        onClose={handleCloseSaveClassifierDialog}
        open={SaveClassifierDialogOpen}
      />
      <FitClassifierDialog
        openedDialog={fitClassifierDialogOpen}
        closeDialog={handleCloseFitClassifierDialog}
      />
      <EvaluateClassifierDialog
        openedDialog={evaluateClassifierDialogOpen}
        closeDialog={handleCloseEvaluateClassifierDialog}
      />
    </>
  );
};
