import * as React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { AppBar, IconButton, Theme, Toolbar, Tooltip } from "@mui/material";
import {
  ArrowBack,
  PlayCircleOutline,
  ReplayRounded,
} from "@mui/icons-material";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    button: {},
    grow: {
      flexGrow: 1,
    },
    appBar: {
      position: "relative",
      backgroundColor: "transparent",
      boxShadow: "none",
      borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    },
    appBarShift: {},
    appBarShiftLeft: {},
  })
);

export const PredictClassifierDialogAppBar = (props: any) => {
  const { closeDialog, fit } = props;

  const classes = useStyles({});

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Tooltip title="Close Dialog" placement="bottom">
          <IconButton
            edge="start"
            color="primary"
            onClick={closeDialog}
            aria-label="Close"
            href={""}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <div className={classes.grow} />

        <Tooltip title="Predict the model" placement="bottom">
          <IconButton className={classes.button} onClick={fit} href={""}>
            <PlayCircleOutline />
          </IconButton>
        </Tooltip>

        <IconButton
          disabled
          className={classes.button}
          onClick={closeDialog}
          href={""}
        >
          <ReplayRounded />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
