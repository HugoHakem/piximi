import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CircularProgress,
  Grid,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";

import { LabelImportant as LabelImportantIcon } from "@mui/icons-material";

import { useTranslation } from "hooks";

import { DisabledListItemButton } from "components/common/list-items/DisabledListItemButton/DisabledListItemButton";

import {
  classifierSlice,
  classifierModelStatusSelector,
} from "store/classifier";
import { ModelStatus } from "types/ModelType";

type PredictClassifierListItemProps = {
  disabled: boolean;
  helperText: string;
};

export const PredictClassifierListItem = (
  props: PredictClassifierListItemProps
) => {
  const dispatch = useDispatch();

  const t = useTranslation();

  const [isPredicting, setIsPredicting] = React.useState<boolean>(false);

  const onPredict = () => {
    dispatch(
      classifierSlice.actions.updateModelStatus({
        modelStatus: ModelStatus.Predicting,
        execSaga: true,
      })
    );
  };

  const modelStatus = useSelector(classifierModelStatusSelector);

  useEffect(() => {
    setIsPredicting(modelStatus === ModelStatus.Predicting);
  }, [modelStatus]);

  return (
    <Grid item xs={4}>
      <DisabledListItemButton {...props} onClick={onPredict}>
        <Stack sx={{ alignItems: "center" }}>
          <ListItemIcon sx={{ justifyContent: "center" }}>
            {isPredicting ? (
              <CircularProgress disableShrink size={24} />
            ) : (
              <LabelImportantIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={t("Predict")} />
        </Stack>
      </DisabledListItemButton>
    </Grid>
  );
};
