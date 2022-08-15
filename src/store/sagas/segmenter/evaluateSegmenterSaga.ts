import { Category } from "types/Category";
import { SegmenterEvaluationResultType } from "types/EvaluationResultType";
import { ImageType } from "types/ImageType";
import { applicationSlice, segmenterSlice } from "../../slices";
import { LayersModel, Tensor, data, Rank } from "@tensorflow/tfjs";
import { put, select } from "redux-saga/effects";
import { AlertStateType, AlertType } from "types/AlertStateType";
import { getStackTraceFromError } from "utils/getStackTrace";
import {
  fittedSegmentationModelSelector,
  segmentationValDataSelector,
  segmentationValImagesSelector,
} from "store/selectors/segmenter";
import { annotationCategoriesSelector } from "store/selectors/annotatorCategoriesSelector";
import { evaluateSegmenter } from "store/coroutines/segmenter";

export function* evaluateSegmenterSaga(action: any): any {
  const model: LayersModel = yield select(fittedSegmentationModelSelector);

  const validationImages: Array<ImageType> = yield select(
    segmentationValImagesSelector
  );

  yield put(yield put(applicationSlice.actions.hideAlertState({})));

  const categories: Array<Category> = yield select(
    annotationCategoriesSelector
  );

  if (validationImages.length === 0) {
    yield put(
      applicationSlice.actions.updateAlertState({
        alertState: {
          alertType: AlertType.Info,
          name: "Validation set is empty",
          description: "Cannot evaluate model on empty validation set.",
        },
      })
    );
  } else {
    yield runSegmentationEvaluation(validationImages, model, categories);
  }

  yield put(
    segmenterSlice.actions.updateEvaluating({
      evaluating: false,
    })
  );
}

function* runSegmentationEvaluation(
  validationImages: Array<ImageType>,
  model: LayersModel,
  categories: Array<Category>
) {
  const validationData: data.Dataset<{
    xs: Tensor<Rank.R4>;
    ys: Tensor<Rank.R4>;
    id: Tensor<Rank.R1>;
  }> = yield select(segmentationValDataSelector);

  try {
    var evaluationResult: SegmenterEvaluationResultType =
      yield evaluateSegmenter(
        model,
        validationData,
        validationImages,
        categories
      );
  } catch (error) {
    yield handleError(error as Error, "Error computing the evaluation results");
    return;
  }

  yield put(
    segmenterSlice.actions.updateSegmentationEvaluationResult({
      evaluationResult,
    })
  );
}

function* handleError(error: Error, name: string): any {
  const stackTrace = yield getStackTraceFromError(error);

  const alertState: AlertStateType = {
    alertType: AlertType.Error,
    name: name,
    description: `${error.name}:\n${error.message}`,
    stackTrace: stackTrace,
  };

  yield put(
    applicationSlice.actions.updateAlertState({
      alertState: alertState,
    })
  );
}