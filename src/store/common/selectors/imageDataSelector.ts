import { ImageType, Annotator, Project, ShadowImageType } from "types";

export const imageDataSelector = ({
  annotator,
  project,
}: {
  annotator: Annotator;
  project: Project;
}) => {
  if (!annotator.images.length || !annotator.activeImageId) return;

  /*
   * return image data from full image in projects,
   * if not in projects, full image in annotator,
   * so return image data from there instead
   */
  const image =
    project.images.find((image: ImageType) => {
      return image.id === annotator.activeImageId;
    }) ||
    annotator.images.find((image: ShadowImageType) => {
      return image.id === annotator.activeImageId;
    });

  if (!image) return;

  return image.data;
};