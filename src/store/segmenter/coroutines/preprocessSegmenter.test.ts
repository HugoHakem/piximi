// TODO: post PR #407, get working for segmenter
import "@tensorflow/tfjs-node";
import { preprocessSegmentationImages } from "./preprocessSegmenter";
import {
  convertToImage,
  loadImageFileAsStack,
  MIMEType,
} from "image/utils/imageHelper";
import { fileFromPath } from "image/utils/nodeImageHelper";
import { Category } from "types/Category";
import { ImageType } from "types/ImageType";
import { Partition } from "types/Partition";
import { Shape } from "types/Shape";
import { RescaleOptions } from "types/RescaleOptions";
import { FitOptions } from "types/FitOptions";
import { CropOptions, CropSchema } from "types/CropOptions";
import { PreprocessOptions } from "types/PreprocessOptions";
import { encodedAnnotationType } from "types";

//jest.setTimeout(50000);

const inputShape: Shape = {
  planes: 1,
  height: 256,
  width: 256,
  channels: 3,
};

const rescaleOptions: RescaleOptions = {
  rescale: true,
  center: false,
};

const cropOptions: CropOptions = {
  numCrops: 1,
  cropSchema: CropSchema.None,
};

const preprocessingOptions: PreprocessOptions = {
  shuffle: true,
  rescaleOptions,
  cropOptions,
};

const fitOptions: FitOptions = {
  epochs: 10,
  batchSize: 32,
  initialEpoch: 0,
};

const annotationCategories: Array<Category> = [
  {
    color: "#920000",
    id: "00000000-0000-1111-0000-000000000000",
    name: "Unknown",
    visible: true,
  },
  {
    color: "#006ddb",
    id: "1dca6ba0-c53b-435d-a43f-d4a2bb4042a5",
    name: "Test",
    visible: true,
  },
];

const preloadedImages: Array<{
  src: string;
  name: string;
  mimetype: MIMEType;
  annotations: Array<encodedAnnotationType>;
}> = [
  {
    src: "/static/media/cell-painting.f118ef087853056f08e6.png",
    name: "cell-painting.png",
    mimetype: "image/png",
    annotations: [
      {
        boundingBox: [86, 149, 217, 240],
        categoryId: "1dca6ba0-c53b-435d-a43f-d4a2bb4042a5",
        id: "59b919c0-f052-4df6-b947-bb8f3c9359a7",
        mask: [0, 11921],
        plane: 0,
      },
    ],
  },
];

const urlToStack = async (src: string, name: string, mimetype: MIMEType) => {
  const file = await fileFromPath(src, mimetype, false, name);

  return loadImageFileAsStack(file);
};

it.skip("preprocessSegmenter", async () => {
  const images: Array<ImageType> = [];

  for (const preIm of preloadedImages) {
    const imStack = await urlToStack(preIm.src, preIm.name, preIm.mimetype);
    const im = await convertToImage(
      imStack,
      preIm.name,
      undefined,
      1,
      imStack.length
    );

    images.push({
      ...im,
      annotations: preIm.annotations,
      partition: Partition.Training,
    });
  }

  const preprocessed = await preprocessSegmentationImages(
    images,
    annotationCategories,
    inputShape,
    preprocessingOptions,
    fitOptions
  );

  // future warning: toArrayForTest is undocumented
  const items = await preprocessed.toArrayForTest();

  expect(items[0]["xs"].shape).toEqual([256, 256, 3]);
  expect(items[0]["ys"].shape).toEqual([256, 256, 1]);
});
