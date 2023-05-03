import { ToolType } from "./ToolType";
import { AnnotationModeType } from "./AnnotationModeType";
import { AnnotationStateType } from "./AnnotationStateType";

export type ImageViewerStore = {
  annotationState: AnnotationStateType;
  brightness: number;
  contrast: number;
  currentIndex: number;
  currentPosition?: { x: number; y: number };
  cursor: string;
  exposure: number;
  hue: number;
  activeImageId?: string;
  activeAnnotationIds: Array<string>;
  previousImageId?: string;
  hiddenCategoryIds: string[];
  activeImageRenderedSrcs: Array<string>;
  imageOrigin: { x: number; y: number };
  penSelectionBrushSize: number;
  pointerSelection: {
    dragging: boolean;
    selecting: boolean;
    minimum: { x: number; y: number } | undefined;
    maximum: { x: number; y: number } | undefined;
  };
  quickSelectionRegionSize: number;
  thresholdAnnotationValue: number;
  saturation: number;
  workingAnnotationId: string | undefined;
  selectedAnnotationIds: Array<string>;
  stagedAnnotationIds: Array<string>;
  stagedAnnotationsHaveBeenUpdated: boolean;
  selectedCategoryId: string;
  selectionMode: AnnotationModeType;
  stageHeight: number;
  stageScale: number;
  stageWidth: number;
  stagePosition: { x: number; y: number };
  toolType: ToolType;
  vibrance: number;
  zoomSelection: {
    dragging: boolean;
    minimum: { x: number; y: number } | undefined;
    maximum: { x: number; y: number } | undefined;
    selecting: boolean;
    centerPoint: { x: number; y: number } | undefined;
  };
};
