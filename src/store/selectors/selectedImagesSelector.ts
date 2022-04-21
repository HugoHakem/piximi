import { Settings } from "../../types/Settings";
import { Project } from "../../types/Project";
import { ImageType } from "../../types/ImageType";
import { Category } from "../../types/Category";

export const selectedImagesSelector = ({
  project,
  settings,
}: {
  project: Project;
  settings: Settings;
}): Array<string> => {
  const visibleCategories: Array<string> = project.categories
    .filter((category: Category) => {
      return category.visible;
    })
    .map((category: Category) => {
      return category.id;
    });

  return settings.selectedImages.filter((id: string) => {
    return (
      project.images.filter((image: ImageType) => {
        return (
          id === image.id &&
          visibleCategories.includes(image.categoryId) &&
          image.visible
        );
      }).length > 0
    );
  });
};
