import { combineReducers } from "redux";
import { applicationSlice } from "store/application";
import { classifierSlice } from "store/classifier";
import { imageViewerSlice } from "store/imageViewer";
import { projectSlice } from "store/project";
import { segmenterSlice } from "store/segmenter";
import { dataSlice } from "store/data/";
import { annotatorSlice } from "store/annotator";

const reducers = {
  classifier: classifierSlice.reducer,
  segmenter: segmenterSlice.reducer,
  imageViewer: imageViewerSlice.reducer,
  project: projectSlice.reducer,
  settings: applicationSlice.reducer,
  data: dataSlice.reducer,
  annotator: annotatorSlice.reducer,
};

export const reducer = combineReducers(reducers);
export type RootState = ReturnType<typeof reducer>;
