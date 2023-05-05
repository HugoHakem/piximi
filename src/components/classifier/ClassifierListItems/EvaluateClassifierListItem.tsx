import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CircularProgress,
  Grid,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { useDialog, useTranslation } from "hooks";

import { EvaluateClassifierDialog } from "../EvaluateClassifierDialog/EvaluateClassifierDialog";
import { DisabledListItemButton } from "components/common/list-items/DisabledListItemButton/DisabledListItemButton";

import {
  classifierEvaluationResultSelector,
  classifierModelStatusSelector,
  classifierSlice,
} from "store/classifier";
import { selectCreatedImageCategories } from "store/data";

import { Category } from "types";
import { ModelStatus } from "types/ModelType";

type EvaluateClassifierListItemProps = {
  disabled: boolean;
  helperText: string;
};

export const EvaluateClassifierListItem = (
  props: EvaluateClassifierListItemProps
) => {
  const { onClose, onOpen, open } = useDialog();
  const dispatch = useDispatch();
  const t = useTranslation();

  const categories: Category[] = useSelector(selectCreatedImageCategories);
  const modelStatus = useSelector(classifierModelStatusSelector);
  const evaluationResult = useSelector(classifierEvaluationResultSelector);

  const onEvaluate = async () => {
    dispatch(
      classifierSlice.actions.updateModelStatus({
        modelStatus: ModelStatus.Evaluating,
        execSaga: true,
      })
    );
  };

  useEffect(() => {
    // TODO - segmenter: actually want this after evaluating is complete
    if (modelStatus === ModelStatus.Evaluating) {
      onOpen();
    }
  }, [modelStatus, onOpen]);

  return (
    <Grid item xs={4}>
      <DisabledListItemButton {...props} onClick={onEvaluate}>
        <Stack sx={{ alignItems: "center" }}>
          <ListItemIcon sx={{ justifyContent: "center" }}>
            {modelStatus === ModelStatus.Evaluating ? (
              <CircularProgress disableShrink size={24} />
            ) : (
              <AssessmentIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={t("Evaluate")} />
        </Stack>
      </DisabledListItemButton>

      <EvaluateClassifierDialog
        openedDialog={open}
        closeDialog={onClose}
        confusionMatrix={evaluationResult.confusionMatrix}
        classNames={categories.map((c: Category) => c.name)}
        accuracy={evaluationResult.accuracy}
        crossEntropy={evaluationResult.crossEntropy}
        precision={evaluationResult.precision}
        recall={evaluationResult.recall}
        f1Score={evaluationResult.f1Score}
      />
    </Grid>
  );
};
