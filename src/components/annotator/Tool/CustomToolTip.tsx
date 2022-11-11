// @ts-nocheck
import {
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { ReactElement, useState } from "react";
import { ToolBarToolTitle } from "./ToolBarToolTitle";

type TooltipCardProps = {
  name: string;
  description: string | ReactElement;
  onClose: () => void;
};

export const TooltipCard = ({
  name,
  description,
  onClose,
}: TooltipCardProps) => {
  return (
    <Card sx={{ width: 210 }} variant="outlined">
      <CardActionArea>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="span">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export const CustomToolTip = ({
  children,
  name,
  letter,
}: {
  children: React.ReactNode;
  name: string;
  letter: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const description = <ToolBarToolTitle toolName={name} letter={letter} />;
  const onClose = () => {
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(true);
  };
  return (
    <Tooltip
      // can't use "sx" prop directly to access tooltip
      // see: https://github.com/mui-org/material-ui/issues/28679
      componentsProps={{
        tooltip: {
          sx: { backgroundColor: "transparent", maxWidth: "none" },
        },
      }}
      onClose={onClose}
      onOpen={onOpen}
      open={open}
      placement="left"
      title={
        <TooltipCard name={name} description={description} onClose={onClose} />
      }
    >
      {children}
    </Tooltip>
  );
};
