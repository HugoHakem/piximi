import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import LabelImportantIcon from "@material-ui/icons/LabelImportant";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import List from "@material-ui/core/List";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import { ClassifierSettingsDialog } from "../ClassifierSettingsDialog";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { FitClassifierListItem } from "../FitClassifierListItem";
import { EvaluateClassifierListItem } from "../EvaluateClassifierListItem";

export const ClassifierList = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  const onCollapseClick = () => {
    setCollapsed(!collapsed);
  };

  const [
    openClassifierSettingsDialog,
    setOpenClassifierSettingsDialog,
  ] = React.useState(false);

  const onOpenClassifierSettingsDialog = () => {
    setOpenClassifierSettingsDialog(true);
  };

  const onCloseClassifierSettingsDialog = () => {
    setOpenClassifierSettingsDialog(false);
  };

  return (
    <React.Fragment>
      <List dense>
        <ListItem button dense onClick={onCollapseClick}>
          <ListItemIcon>
            {collapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemIcon>

          <ListItemText primary="Classifier" />

          <ListItemSecondaryAction>
            <Tooltip title="Classifier settings">
              <IconButton edge="end" onClick={onOpenClassifierSettingsDialog}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>

        <Collapse in={collapsed} timeout="auto" unmountOnExit>
          <List component="div" dense disablePadding>
            <FitClassifierListItem />

            <EvaluateClassifierListItem />

            <ListItem button disabled>
              <ListItemIcon>
                <LabelImportantIcon />
              </ListItemIcon>

              <ListItemText primary="Predict" />
            </ListItem>
          </List>
        </Collapse>
      </List>

      <ClassifierSettingsDialog
        onClose={onCloseClassifierSettingsDialog}
        open={openClassifierSettingsDialog}
      />
    </React.Fragment>
  );
};
