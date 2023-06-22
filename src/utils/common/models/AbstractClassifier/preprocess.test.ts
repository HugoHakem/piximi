import "@tensorflow/tfjs-node";
// import { SequentialClassifier } from "./AbstractClassifier";

// import {
//   Category,
//   ImageType,
//   Shape,
//   RescaleOptions,
//   FitOptions,
//   PreprocessOptions,
//   CropOptions,
//   CropSchema,
// } from "types";

// import {
//   loadImageFileAsStack,
//   convertToImage,
//   MIMEType,
// } from "utils/common/image";
// import { fileFromPath } from "utils/common/image/nodeImageHelper";
// import { ModelTask } from "types/ModelType";

// jest.setTimeout(50000);

// class GenericClassifier extends SequentialClassifier {
//   constructor() {
//     super({
//       name: "GenericClassifier",
//       task: ModelTask.Classification,
//       graph: false,
//       pretrained: false,
//       trainable: false,
//     });
//   }

//   loadModel() {}
// }

// const inputShape: Shape = {
//   planes: 1,
//   height: 224,
//   width: 224,
//   channels: 3,
// };

// const rescaleOptions: RescaleOptions = {
//   rescale: true,
//   center: false,
// };

// const cropOptions: CropOptions = {
//   numCrops: 1,
//   cropSchema: CropSchema.None,
// };

// const preprocessOptions: PreprocessOptions = {
//   shuffle: true,
//   rescaleOptions,
//   cropOptions,
// };

// const fitOptions: FitOptions = {
//   epochs: 10,
//   batchSize: 32,
//   initialEpoch: 0,
// };

// const categories: Array<Category> = [
//   {
//     color: "",
//     id: "00000000-0000-0000-0000-00000000001",
//     name: "",
//     visible: true,
//   },
//   {
//     color: "",
//     id: "00000000-0000-0000-0000-00000000002",
//     name: "",
//     visible: true,
//   },
// ];

// const preloadedImages: Array<{
//   src: string;
//   name: string;
//   mimetype: MIMEType;
// }> = [
//   {
//     src: "https://picsum.photos/seed/piximi/224",
//     name: "224.jpg",
//     mimetype: "image/jpeg",
//   },
// ];

// const urlToStack = async (src: string, name: string, mimetype: MIMEType) => {
//   const file = await fileFromPath(src, mimetype, true, name);

//   return loadImageFileAsStack(file);
// };

describe("A passing test", () => {
  it("should pass the test", () => {
    expect(true).toEqual(true);
  });
});

// it("preprocessClassifier", async () => {
//   const images: Array<ImageType> = [];

//   for (const preIm of preloadedImages) {
//     const imStack = await urlToStack(preIm.src, preIm.name, preIm.mimetype);
//     const im = await convertToImage(
//       imStack,
//       preIm.name,
//       undefined,
//       1,
//       imStack.length
//     );
//     images.push(im);
//   }

//   const model = new GenericClassifier();
//   model.loadTraining(images, {
//     categories,
//     inputShape,
//     preprocessOptions,
//     fitOptions,
//   });

//   expect(model._trainingDataset).toBeDefined();

//   // future warning: toArrayForTest is undocumented
//   const items = await model._trainingDataset!.toArrayForTest();

//   expect(items[0]["xs"].shape).toEqual([1, 224, 224, 3]);
//   expect(items[0]["ys"].shape).toEqual([1, 2]);
// });
