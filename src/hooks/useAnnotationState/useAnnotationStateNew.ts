import { AnnotationTool } from "annotator-tools-new";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { annotatorSlice } from "store/slices/annotator";
import { selectAnnotationSelectionMode } from "store/slices/annotator/selectors";
import { selectActiveImageId } from "store/slices/imageViewer";
import { RootState } from "store/rootReducer";
import { AnnotationModeType, AnnotationStateType } from "types";
import { selectCategoryById } from "store/slices/newData/selectors/selectors";
import { selectActiveImage } from "store/slices/imageViewer/reselectors";
import { selectSelectedIVCategoryId } from "store/slices/imageViewer/selectors/selectSelectedAnnotationCategoryId";

export const useAnnotationStateNew = (annotationTool: AnnotationTool) => {
  const dispatch = useDispatch();
  const selectionMode = useSelector(selectAnnotationSelectionMode);
  const activeImage = useSelector(selectActiveImage);
  const activeImageId = useSelector(selectActiveImageId);
  const selectedCategoryId = useSelector(selectSelectedIVCategoryId);
  const selectedCategory = useSelector((state: RootState) =>
    selectCategoryById(state, selectedCategoryId!)
  );

  const onAnnotating = useMemo(() => {
    const func = () => {
      dispatch(
        annotatorSlice.actions.setAnnotationStateNew({
          annotationState: AnnotationStateType.Annotating,
          annotationTool,
        })
      );
    };
    return func;
  }, [annotationTool, dispatch]);

  const onAnnotated = useMemo(() => {
    const func = () => {
      dispatch(
        annotatorSlice.actions.setAnnotationStateNew({
          annotationState: AnnotationStateType.Annotated,
          kind: selectedCategory?.kind,
          annotationTool,
        })
      );
      if (selectionMode !== AnnotationModeType.New) return;
      annotationTool.annotate(
        selectedCategory!,
        activeImage!.activePlane,
        activeImageId!
      );
    };
    return func;
  }, [
    annotationTool,
    selectedCategory,
    activeImage,
    selectionMode,
    dispatch,
    activeImageId,
  ]);

  const onDeselect = useMemo(() => {
    const func = () => {
      dispatch(
        annotatorSlice.actions.setAnnotationStateNew({
          annotationState: AnnotationStateType.Blank,
          kind: selectedCategory?.kind,
          annotationTool,
        })
      );
    };
    return func;
  }, [annotationTool, selectedCategory, dispatch]);
  useEffect(() => {
    annotationTool.registerOnAnnotatedHandler(onAnnotated);
    annotationTool.registerOnAnnotatingHandler(onAnnotating);
    annotationTool.registerOnDeselectHandler(onDeselect);
  }, [annotationTool, onAnnotated, onAnnotating, onDeselect]);
};