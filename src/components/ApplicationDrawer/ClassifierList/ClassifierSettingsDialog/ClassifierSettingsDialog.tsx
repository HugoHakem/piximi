import React from "react";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useStyles } from "../../../../index.css";
import Container from "@material-ui/core/Container";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { LossFunction } from "../../../../types/LossFunction";
import { OptimizationAlgorithm } from "../../../../types/OptimizationAlgorithm";
import { classifierSlice } from "../../../../store/slices";
import { compileOptionsSelector } from "../../../../store/selectors/compileOptionsSelector";
import { fitOptionsSelector } from "../../../../store/selectors/fitOptionsSelector";
import { openedSelector } from "../../../../store/selectors";

const enumKeys = <O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] => {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
};

type ClassifierSettingsDialogProps = {
  onClose: () => void;
  open: boolean;
};

export const ClassifierSettingsDialog = ({
  onClose,
  open,
}: ClassifierSettingsDialogProps) => {
  const dispatch = useDispatch();

  const compileOptions = useSelector(compileOptionsSelector);

  const fitOptions = useSelector(fitOptionsSelector);

  const opened = useSelector(openedSelector);

  const classes = useStyles();

  const onBatchSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(
      classifierSlice.actions.updateBatchSize({
        batchSize: parseFloat(event.target.value as string),
      })
    );
  };

  const onCompile = () => {
    const payload = { opened: opened, options: compileOptions };

    dispatch(classifierSlice.actions.compile(payload));

    console.info("compiled");

    onClose();
  };

  const onEpochsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(
      classifierSlice.actions.updateEpochs({
        epochs: parseFloat(event.target.value as string),
      })
    );
  };

  const onLearningRateChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      classifierSlice.actions.updateLearningRate({
        learningRate: parseFloat(event.target.value as string),
      })
    );
  };

  const onLossFunctionChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      classifierSlice.actions.updateLossFunction({
        lossFunction: event.target.value as LossFunction,
      })
    );
  };

  const onOptimizationAlgorithmChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      classifierSlice.actions.updateOptimizationAlgorithm({
        optimizationAlgorithm: event.target.value as OptimizationAlgorithm,
      })
    );
  };

  return (
    <Dialog fullScreen onClose={onClose} open={open}>
      <AppBar className={classes.settingsDialogAppBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onCompile}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent className={classes.classifierSettingsDialogContent}>
        <Container className={classes.container} maxWidth="md">
          <Tabs
            centered
            indicatorColor="primary"
            onChange={() => {}}
            textColor="primary"
            value={0}
            variant="fullWidth"
          >
            <Tab label="Preprocessing" />
            <Tab label="Training" />
            <Tab label="Architecture" />
          </Tabs>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <React.Fragment />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                helperText="&nbsp;"
                id="optimization-algorithm"
                label="Optimization algorithm"
                onChange={onOptimizationAlgorithmChange}
                select
                value={compileOptions.optimizationAlgorithm}
              >
                {enumKeys(OptimizationAlgorithm).map((k) => {
                  return (
                    <MenuItem key={k} value={OptimizationAlgorithm[k]}>
                      {OptimizationAlgorithm[k]}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                helperText="&nbsp;"
                id="learning-rate"
                label="Learning rate"
                onChange={onLearningRateChange}
                type="number"
                value={compileOptions.learningRate}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                helperText="&nbsp;"
                id="loss-function"
                label="Loss function"
                onChange={onLossFunctionChange}
                select
                value={compileOptions.lossFunction}
              >
                {enumKeys(LossFunction).map((k) => {
                  return (
                    <MenuItem key={k} value={LossFunction[k]}>
                      {LossFunction[k]}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                helperText="&nbsp;"
                id="batch-size"
                label="Batch size"
                onChange={onBatchSizeChange}
                type="number"
                value={fitOptions.batchSize}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                fullWidth
                helperText="&nbsp;"
                id="epochs"
                label="Epochs"
                onChange={onEpochsChange}
                type="number"
                value={fitOptions.epochs}
              />
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
    </Dialog>
  );
};