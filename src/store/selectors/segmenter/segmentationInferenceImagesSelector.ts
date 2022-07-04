import { Project } from "types/Project";
import { ImageType } from "types/ImageType";
import { Partition } from "types/Partition";

export const segmentationInferenceImagesSelector = ({
  project,
}: {
  project: Project;
}): Array<ImageType> => {
  return project.images.filter((image: ImageType) => {
    return image.segmentationPartition === Partition.Inference;
  });
};
