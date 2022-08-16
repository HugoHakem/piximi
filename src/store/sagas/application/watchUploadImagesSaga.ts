import { takeLeading } from "redux-saga/effects";

import { uploadImagesSaga } from "./uploadImagesSaga";

import { applicationSlice } from "store/application";

export function* watchUploadImagesSaga(): any {
  yield takeLeading(applicationSlice.actions.uploadImages, uploadImagesSaga);
}
