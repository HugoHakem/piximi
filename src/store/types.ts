import { History } from "@tensorflow/tfjs";
import {
  AnnotationModeType,
  AnnotationStateType,
  ToolType,
} from "utils/annotator/enums";

import {
  ColorAdjustmentOptionsType,
  ZoomToolOptionsType,
} from "utils/annotator/types";

import { AlertState, FilterType } from "utils/common/types";
import {
  HotkeyView,
  ImageSortKey,
  Languages,
  ThingSortKey_new,
} from "utils/common/enums";
import { ThemeMode } from "themes/enums";

import {
  ClassifierEvaluationResultType,
  FitOptions,
  PreprocessOptions,
  CompileOptions,
  SegmenterEvaluationResultType,
} from "utils/models/types";
import {
  LossFunction,
  Metric,
  ModelStatus,
  OptimizationAlgorithm,
} from "utils/models/enums";

import { DeferredEntityState } from "./entities";
import { AnyAction, Dispatch, TypedStartListening } from "@reduxjs/toolkit";
import {
  OldAnnotationType,
  OldDecodedAnnotationType,
  OldImageType,
  Kind,
  AnnotationObject,
  Category,
  DecodedAnnotationObject,
  ImageObject,
  Shape,
} from "./data/types";

export type SegmenterState = {
  // pre-fit state
  selectedModelIdx: number;
  inputShape: Shape;
  preprocessOptions: PreprocessOptions;
  fitOptions: FitOptions;

  compileOptions: CompileOptions;

  trainingPercentage: number;
  trainingHistory?: History;
  evaluationResult: SegmenterEvaluationResultType;

  modelStatus: ModelStatus;
};

export type ProjectState = {
  name: string;
  selectedImageIds: Array<string>;
  selectedThingIds: Array<string>;
  imageSortKey: ImageSortKey;
  sortType_new: ThingSortKey_new;
  imageFilters: Required<
    Pick<FilterType<OldImageType>, "categoryId" | "partition">
  >;
  thingFilters: Record<
    string,
    Required<Pick<FilterType<OldImageType>, "categoryId" | "partition">>
  >;
  annotationFilters: Required<
    Pick<FilterType<OldAnnotationType>, "categoryId">
  >;
  highlightedCategory: string | undefined;
  selectedAnnotationIds: string[];
  activeKind: string;
  loadPercent: number;
  loadMessage: string;
};

export type ImageViewerState = {
  imageStack: string[];
  colorAdjustment: ColorAdjustmentOptionsType;
  cursor: string;
  activeImageId?: string;
  activeAnnotationIds: Array<string>;
  previousImageId?: string;
  annotationFilters: Required<
    Pick<FilterType<OldAnnotationType>, "categoryId">
  >;
  filters: Required<Pick<FilterType<AnnotationObject>, "categoryId">>;
  activeImageRenderedSrcs: Array<string>;
  imageOrigin: { x: number; y: number };
  workingAnnotationId: string | undefined;
  workingAnnotation: {
    saved: OldDecodedAnnotationType | undefined;
    changes: Partial<OldDecodedAnnotationType>;
  };
  workingAnnotationNew: {
    saved: DecodedAnnotationObject | undefined;
    changes: Partial<DecodedAnnotationObject>;
  };
  selectedAnnotationIds: Array<string>;
  selectedCategoryId: string;
  stageHeight: number;
  stageScale: number;
  stageWidth: number;
  stagePosition: { x: number; y: number };
  zoomSelection: {
    dragging: boolean;
    minimum: { x: number; y: number } | undefined;
    maximum: { x: number; y: number } | undefined;
    selecting: boolean;
    centerPoint: { x: number; y: number } | undefined;
  };
  zoomOptions: ZoomToolOptionsType;
  imageIsLoading: boolean;
  highlightedCategory?: string;
};

export type DataState = {
  kinds: DeferredEntityState<Kind>;
  categories: DeferredEntityState<Category>;
  things: DeferredEntityState<AnnotationObject | ImageObject>;
};

export type ClassifierState = {
  // pre-fit state
  selectedModelIdx: number;
  inputShape: Shape;
  preprocessOptions: PreprocessOptions;
  fitOptions: FitOptions;

  learningRate: number;
  lossFunction: LossFunction;
  optimizationAlgorithm: OptimizationAlgorithm;
  metrics: Array<Metric>;

  trainingPercentage: number;
  // post-evaluation results
  evaluationResult: ClassifierEvaluationResultType;
  // status flags
  modelStatus: ModelStatus;
};

export type AppSettingsState = {
  // async work for setting initial states,
  // for all store slices,
  // should be completed before this flag is set to true
  init: boolean;
  tileSize: number;
  themeMode: ThemeMode;
  imageSelectionColor: string;
  selectedImageBorderWidth: number;
  alertState: AlertState;
  hotkeyStack: HotkeyView[];
  language: Languages;
  soundEnabled: boolean;
};

export type AnnotatorState = {
  annotationState: AnnotationStateType;
  penSelectionBrushSize: number;
  quickSelectionRegionSize: number;
  thresholdAnnotationValue: number;
  selectionMode: AnnotationModeType;
  toolType: ToolType;
};

export type AppState = {
  classifier: ClassifierState;
  segmenter: SegmenterState;
  imageViewer: ImageViewerState;
  annotator: AnnotatorState;
  project: ProjectState;
  applicationSettings: AppSettingsState;
  newData: DataState;
};

export type AppDispatch = Dispatch<AnyAction>;

export type TypedAppStartListening = TypedStartListening<AppState, AppDispatch>;
