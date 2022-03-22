import React from "react";
import { ApplicationToolbar } from "../ApplicationToolbar";
import { AppBar, Box } from "@mui/material";
import { AlertDialog } from "components/AlertDialog/AlertDialog";
import { useSelector } from "react-redux";
import { alertStateSelector } from "store/selectors/alertStateSelector";

export const ApplicationAppBar = () => {
  const alertState = useSelector(alertStateSelector);

  return (
    <Box>
      <AppBar
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          boxShadow: "none",
        }}
        color="inherit"
        position="fixed"
      >
        <ApplicationToolbar />

        {alertState.visible && <AlertDialog alertState={alertState} />}
      </AppBar>
    </Box>
  );
};
