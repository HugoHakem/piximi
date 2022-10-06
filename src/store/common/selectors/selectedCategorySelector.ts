import { Category, ImageViewer, Project } from "types";

export const selectedCategorySelector = ({
  imageViewer,
  project,
}: {
  imageViewer: ImageViewer;
  project: Project;
}): Category => {
  const category = project.annotationCategories.find((category: Category) => {
    return category.id === imageViewer.selectedCategoryId;
  });

  return category!;
};
