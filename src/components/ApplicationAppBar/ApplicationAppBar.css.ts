import { makeStyles } from "@mui/styles";

import { Theme } from "@mui/material";

export const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
    boxShadow: "none",
  },
  grow: {
    flexGrow: 1,
  },
}));
