import { Project } from "types/Project";
import { ImageType } from "types/ImageType";

export const annotatedImagesSelector = ({
  project,
}: {
  project: Project;
}): Array<ImageType> => {
  return project.images.filter((image: ImageType) => {
    return image.annotations.length;
  });
};
