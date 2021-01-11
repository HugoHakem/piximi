import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import Slider from "@material-ui/core/Slider";
import Collapse from "@material-ui/core/Collapse";
import Switch from "@material-ui/core/Switch";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { Image } from "../../../types/Image";

const LIGHTNESS_OPTIONS = [
  { name: "Exposure" },
  { name: "Highlights" },
  { name: "Shadows" },
  { name: "Brightness" },
  { name: "Contrast" },
  { name: "Black point" },
];

type ColorAdjustmentOptionsProps = {
  image: Image;
};

export const ColorAdjustmentOptions = ({
  image,
}: ColorAdjustmentOptionsProps) => {
  const Option = ({ name }: { name: string }) => {
    return (
      <ListItem dense>
        <ListItemText
          id="discrete-slider"
          primary={name}
          secondary={
            <Slider
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              value={50}
            />
          }
        />
      </ListItem>
    );
  };

  const [openLightness, setOpenLightness] = React.useState(false);

  const onLightnessToggle = () => {
    setOpenLightness(!openLightness);
  };

  return (
    <React.Fragment>
      <List>
        <ListItem dense disabled>
          <ListItemText primary="Histogram" />
        </ListItem>
      </List>

      <Divider />

      <List dense>
        <ListItem dense>
          <ListItemText primary="Lightness" />

          <ListItemSecondaryAction>
            <Switch
              checked={openLightness}
              edge="end"
              onChange={onLightnessToggle}
            />
          </ListItemSecondaryAction>
        </ListItem>

        <Collapse in={openLightness} timeout="auto" unmountOnExit>
          <List component="div" dense disablePadding>
            {LIGHTNESS_OPTIONS.map((option, index) => {
              return <Option key={index} name={option.name} />;
            })}
          </List>
        </Collapse>
      </List>
    </React.Fragment>
  );
};