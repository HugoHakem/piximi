// ts-nocheck ; TODO - segmenter
import { LayersModel } from "@tensorflow/tfjs";
import { PayloadAction } from "@reduxjs/toolkit";
import { put, select } from "redux-saga/effects";

import { applicationSlice } from "store/application";
import {
  classifierSlice,
  evaluateClassifier,
  preprocessClassifier,
  createClassificationLabels,
  classifierArchitectureOptionsSelector,
  classifierPreprocessOptionsSelector,
  classifierFitOptionsSelector,
  classifierSelectedModelSelector,
} from "store/classifier";
import {
  selectCreatedImageCategories,
  selectImagesByPartition,
} from "store/data";
import {
  AlertStateType,
  AlertType,
  Category,
  ImageType,
  Partition,
} from "types";
import { getStackTraceFromError } from "utils";
import { ModelStatus } from "types/ModelType";

export function* evaluateClassifierSaga({
  payload: { execSaga, modelStatus },
}: PayloadAction<{
  execSaga: boolean;
  modelStatus: ModelStatus;
}>) {
  if (modelStatus !== ModelStatus.Evaluating || !execSaga) return;

  const selectedModel: ReturnType<typeof classifierSelectedModelSelector> =
    yield select(classifierSelectedModelSelector);

  const validationImages: ReturnType<typeof selectImagesByPartition> =
    yield select((state) =>
      selectImagesByPartition(state, Partition.Validation)
    );

  yield put(applicationSlice.actions.hideAlertState({}));

  const categories: ReturnType<typeof selectCreatedImageCategories> =
    yield select(selectCreatedImageCategories);

  const outputLayerSize = selectedModel._model!.outputs[0].shape[1] as number;

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
  } else if (outputLayerSize !== categories.length) {
    yield put(
      applicationSlice.actions.updateAlertState({
        alertState: {
          alertType: AlertType.Warning,
          name: "The output shape of your model does not correspond to the number of categories!",
          description: `The trained model has an output shape of ${outputLayerSize} but there are ${categories.length} categories in  the project.\nMake sure these numbers match by retraining the model with the given setup or upload a corresponding new model.`,
        },
      })
    );
  } else {
    yield runEvaluation(validationImages, selectedModel._model!, categories);
  }

  yield put(
    classifierSlice.actions.updateModelStatus({
      modelStatus: ModelStatus.Trained,
      execSaga: false,
    })
  );
}

function* runEvaluation(
  validationImages: Array<ImageType>,
  model: LayersModel,
  categories: Array<Category>
) {
  const architectureOptions: ReturnType<
    typeof classifierArchitectureOptionsSelector
  > = yield select(classifierArchitectureOptionsSelector);

  const preprocessOptions: ReturnType<
    typeof classifierPreprocessOptionsSelector
  > = yield select(classifierPreprocessOptionsSelector);

  const fitOptions: ReturnType<typeof classifierFitOptionsSelector> =
    yield select(classifierFitOptionsSelector);

  const {
    labels: validationLabels,
    disposeLabels: disposeValidationLabels,
  }: ReturnType<typeof createClassificationLabels> = createClassificationLabels(
    validationImages,
    categories
  );

  const validationData: ReturnType<typeof preprocessClassifier> =
    preprocessClassifier(
      validationImages,
      validationLabels,
      architectureOptions.inputShape,
      preprocessOptions,
      fitOptions
    );

  if (validationData === undefined) {
    yield handleError(
      new Error("No selectable validation data in store"),
      "Failed to get validation data"
    );
    return;
  }

  try {
    var evaluationResult: Awaited<ReturnType<typeof evaluateClassifier>> =
      yield evaluateClassifier(
        model,
        validationData,
        validationImages,
        categories
      );
  } catch (error) {
    yield handleError(error as Error, "Error computing the evaluation results");
    return;
  }

  disposeValidationLabels();

  yield put(
    classifierSlice.actions.updateEvaluationResult({
      evaluationResult,
    })
  );
}

function* handleError(error: Error, name: string) {
  const stackTrace: Awaited<ReturnType<typeof getStackTraceFromError>> =
    yield getStackTraceFromError(error);

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
