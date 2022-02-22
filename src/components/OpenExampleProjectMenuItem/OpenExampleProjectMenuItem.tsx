import {
  applicationSlice,
  classifierSlice,
  projectSlice,
} from "../../store/slices";
import { useDispatch } from "react-redux";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { SerializedProjectType } from "../../types/SerializedProjectType";
import { Classifier } from "../../types/Classifier";
import { ExampleProject } from "data/exampleProjects/exampleProjectsEnum";
import {
  convertSrcURIToOriginalSrcURIs,
  deserializeImages,
  generateDefaultChannels,
} from "image/imageHelper";
import { SerializedImageType } from "types/SerializedImageType";
import { ImageType } from "types/ImageType";

type OpenExampleProjectMenuItemProps = {
  exampleProject: ExampleProject;
  projectName: string;
  projectIcon: string;
  popupState: any;
  onClose: any;
};

export const OpenExampleProjectMenuItem = ({
  exampleProject,
  projectName,
  projectIcon,
  popupState,
  onClose,
}: OpenExampleProjectMenuItemProps) => {
  const dispatch = useDispatch();

  const onClickExampleProject = async () => {
    var exampleProjectJson: any;
    switch (exampleProject) {
      case ExampleProject.Mnist:
        exampleProjectJson = await import(
          "data/exampleProjects/mnistExampleProject.json"
        );
        break;
      case ExampleProject.CElegans:
        exampleProjectJson = await import(
          "data/exampleProjects/cElegansExampleProject.json"
        );
        break;
      case ExampleProject.HumanU2OSCells:
        exampleProjectJson = await import(
          "data/exampleProjects/humanU2OSCellsExampleProject.json"
        );
        break;
      default:
        return;
    }

    const project = exampleProjectJson.project as SerializedProjectType;
    const classifier = exampleProjectJson.classifier as Classifier;
    const images = await deserializeImages(
      project.serializedImages as Array<SerializedImageType>
    );

    popupState.close();
    onClose();

    dispatch(applicationSlice.actions.clearSelectedImages());

    dispatch(
      projectSlice.actions.openProject({
        images: images,
        categories: project.categories,
        name: project.name,
      })
    );

    dispatch(
      classifierSlice.actions.setClassifier({
        classifier: classifier,
      })
    );
  };

  return (
    <ListItem button onClick={onClickExampleProject}>
      <ListItemAvatar>
        <Avatar src={projectIcon}></Avatar>
      </ListItemAvatar>

      <ListItemText primary={projectName} />
    </ListItem>
  );
};
