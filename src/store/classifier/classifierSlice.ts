import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Classifier } from "../../types/Classifier";
import { LossFunction } from "../../types/LossFunction";
import { Metric } from "../../types/Metric";
import { OptimizationAlgorithm } from "../../types/OptimizationAlgorithm";
import { History } from "@tensorflow/tfjs";
import { Shape } from "../../types/Shape";
import { RescaleOptions } from "../../types/RescaleOptions";
import { concreteClassifierModels, ModelStatus } from "../../types/ModelType";
import { ClassifierEvaluationResultType } from "types/EvaluationResultType";
import { CropOptions, CropSchema } from "types/CropOptions";
import { TrainingCallbacks } from "utils/common/models/Model";
import { SequentialClassifier } from "utils/common/models/AbstractClassifier/AbstractClassifier";

export const initialState: Classifier = {
  modelStatus: ModelStatus.Uninitialized,
  inputShape: {
    planes: 1,
    height: 256,
    width: 256,
    channels: 3,
  },
  fitOptions: {
    epochs: 10,
    batchSize: 32,
    initialEpoch: 0,
  },
  learningRate: 0.01,
  lossFunction: LossFunction.CategoricalCrossEntropy,
  selectedModel: concreteClassifierModels[0],
  metrics: [Metric.CategoricalAccuracy],
  optimizationAlgorithm: OptimizationAlgorithm.Adam,
  preprocessOptions: {
    shuffle: true,
    rescaleOptions: {
      rescale: true,
      center: false,
    },
    cropOptions: {
      numCrops: 1,
      cropSchema: CropSchema.None,
    },
  },
  trainingPercentage: 0.75,
  evaluationResult: {
    confusionMatrix: [],
    accuracy: -1,
    crossEntropy: -1,
    precision: -1,
    recall: -1,
    f1Score: -1,
  },
};

export const classifierSlice = createSlice({
  name: "classifier",
  initialState: initialState,
  reducers: {
    resetClassifier: () => initialState,
    setClassifier(state, action: PayloadAction<{ classifier: Classifier }>) {
      // WARNING, don't do below (overwrites draft object)
      // state = action.payload.classifier;
      return action.payload.classifier;
    },
    setDefaults(state, action: PayloadAction<{}>) {
      // TODO - segmenter: dispose() and state.selectedModel = SimpleCNN(), or whatever
      state.modelStatus = ModelStatus.Uninitialized;
      state.evaluationResult = {
        confusionMatrix: [],
        accuracy: -1,
        crossEntropy: -1,
        precision: -1,
        recall: -1,
        f1Score: -1,
      };
    },
    updateModelStatus(
      state,
      action: PayloadAction<{
        modelStatus: ModelStatus;
        onEpochEnd?: TrainingCallbacks["onEpochEnd"]; // used by fit
        execSaga: boolean;
      }>
    ) {
      state.modelStatus = action.payload.modelStatus;
    },
    updateBatchSize(state, action: PayloadAction<{ batchSize: number }>) {
      const { batchSize } = action.payload;

      state.fitOptions.batchSize = batchSize;
    },
    updateEpochs(state, action: PayloadAction<{ epochs: number }>) {
      const { epochs } = action.payload;

      state.fitOptions.epochs = epochs;
    },
    updateFitted(state, action: PayloadAction<{ history: History }>) {
      state.modelStatus = ModelStatus.Trained;

      state.history = action.payload.history;
    },
    updateInputShape(state, action: PayloadAction<{ inputShape: Shape }>) {
      state.inputShape = action.payload.inputShape;
    },
    updateLearningRate(state, action: PayloadAction<{ learningRate: number }>) {
      const { learningRate } = action.payload;

      state.learningRate = learningRate;
    },
    updateLossFunction(
      state,
      action: PayloadAction<{ lossFunction: LossFunction }>
    ) {
      const { lossFunction } = action.payload;

      state.lossFunction = lossFunction;
    },
    updateMetrics(state, action: PayloadAction<{ metrics: Array<Metric> }>) {
      const { metrics } = action.payload;

      state.metrics = metrics;
    },
    updateSelectedModel(
      state,
      action: PayloadAction<{ model: SequentialClassifier }>
    ) {
      state.selectedModel = action.payload.model;
    },
    uploadUserSelectedModel(
      state,
      action: PayloadAction<{
        inputShape: Shape;
        modelSelection: SequentialClassifier;
      }>
    ) {
      state.inputShape = action.payload.inputShape;
      state.selectedModel = action.payload.modelSelection;
    },
    updateOptimizationAlgorithm(
      state,
      action: PayloadAction<{ optimizationAlgorithm: OptimizationAlgorithm }>
    ) {
      const { optimizationAlgorithm } = action.payload;

      state.optimizationAlgorithm = optimizationAlgorithm;
    },
    updateRescaleOptions(
      state,
      action: PayloadAction<{ rescaleOptions: RescaleOptions }>
    ) {
      state.preprocessOptions.rescaleOptions = action.payload.rescaleOptions;
    },
    updateShuffleOptions(state, action: PayloadAction<{ shuffle: boolean }>) {
      state.preprocessOptions.shuffle = action.payload.shuffle;
    },
    updateCropOptions(
      state,
      action: PayloadAction<{ cropOptions: CropOptions }>
    ) {
      state.preprocessOptions.cropOptions = action.payload.cropOptions;
    },
    updateTrainingPercentage(
      state,
      action: PayloadAction<{ trainingPercentage: number }>
    ) {
      const { trainingPercentage } = action.payload;

      state.trainingPercentage = trainingPercentage;
    },
    updateEvaluationResult(
      state,
      action: PayloadAction<{
        evaluationResult: ClassifierEvaluationResultType;
      }>
    ) {
      const { evaluationResult } = action.payload;

      state.evaluationResult = evaluationResult;
    },
  },
});

export const {
  updateBatchSize,
  updateEpochs,
  updateFitted,
  updateLearningRate,
  updateLossFunction,
  updateMetrics,
  updateOptimizationAlgorithm,
  updateTrainingPercentage,
  uploadUserSelectedModel,
  updateModelStatus,
} = classifierSlice.actions;
