import * as ImageJS from "image-js";
import {
  browser,
  scalar,
  tensor1d,
  Tensor2D,
  tensor2d,
  Tensor3D,
  Tensor4D,
  tensor4d,
  tidy,
} from "@tensorflow/tfjs";
// import { v4 as uuidv4 } from "uuid";

import {
  DEFAULT_COLORS,
  // ImageType,
  // Partition,
  // UNKNOWN_CATEGORY_ID,
} from "types";
import { Colors } from "types/tensorflow";

declare module "image-js" {
  interface Image {
    colorDepth(newColorDepth: BitDepth): Image;
    min: number[];
    max: number[];
  }
}

/*
 ======================================
 Image Inspection/Introspection helpers
 ======================================
 */

export enum ImageShapeEnum {
  DicomImage,
  GreyScale,
  SingleRGBImage,
  HyperStackImage,
  InvalidImage,
}

const MIMETYPES = [
  "image/png",
  "image/jpeg",
  "image/tiff",
  "image/dicom",
] as const;

export type MIMEType = typeof MIMETYPES[number];

export interface ImageShapeInfo {
  shape: ImageShapeEnum;
  bitDepth?: ImageJS.BitDepth;
  components?: number;
  alpha?: boolean;
}

export interface ImageFileShapeInfo extends ImageShapeInfo {
  ext: MIMEType;
}

/*
 -----------------
 File blob helpers
 -----------------
 */

export const loadImageAsStack = async (file: File) => {
  try {
    const buffer = await file.arrayBuffer();
    let image = (await ImageJS.Image.load(buffer, {
      ignorePalette: true,
    })) as ImageJS.Image | ImageJS.Stack;

    const imageShapeInfo = getImageInformation(image);

    if (imageShapeInfo.shape !== ImageShapeEnum.HyperStackImage) {
      image = (image as ImageJS.Image).split({ preserveAlpha: false });
      // preserveAlpha removes the alpha data from each ImageJS.Image
      // but its still present as its own ImageJS.Image as the final
      // element of the stack, so remove it
      if (imageShapeInfo.alpha) {
        image = new ImageJS.Stack(image.splice(0, image.length - 1));
      }
      return image;
    } else {
      return image as ImageJS.Stack;
    }
  } catch (err) {
    process.env.NODE_ENV !== "production" &&
      console.error(`Error loading image file ${file.name}`);
    throw err;
  }
};

export const getImageFileInformation = async (
  file: File
): Promise<ImageFileShapeInfo> => {
  const ext = file.type as MIMEType;
  try {
    // https://stackoverflow.com/questions/56565528/typescript-const-assertions-how-to-use-array-prototype-includes
    if (!(MIMETYPES as ReadonlyArray<string>).includes(file.type)) {
      process.env.NODE_ENV !== "production" &&
        console.error("Invalid MIME Type:", ext);
      return { shape: ImageShapeEnum.InvalidImage, ext };
    }

    if (file.name.endsWith("dcm") || file.name.endsWith("DICOM")) {
      return { shape: ImageShapeEnum.DicomImage, ext: "image/dicom" };
    }

    const buffer = await file.arrayBuffer();
    const image: ImageJS.Image | ImageJS.Stack = await ImageJS.Image.load(
      buffer,
      { ignorePalette: true }
    );

    return { ...getImageInformation(image), ext };
  } catch (err) {
    return { shape: ImageShapeEnum.InvalidImage, ext };
  }
};

/*
 ----------------------------
 Image.JS.Image|Stack Helpers
 ----------------------------
*/

export const getImageInformation = (
  image: ImageJS.Image | ImageJS.Stack
): ImageShapeInfo => {
  // a "proper" RGB will be an ImageJS.Image object with 3 components
  if (!Array.isArray(image) && image.components === 3) {
    return {
      shape: ImageShapeEnum.SingleRGBImage,
      components: image.components,
      bitDepth: image.bitDepth,
      alpha: image.alpha === 1,
    };
    // 1 channel (greyscale) image will also be an ImageJs.Image object
  } else if (!Array.isArray(image) && image.components === 1) {
    return {
      shape: ImageShapeEnum.GreyScale,
      components: image.components,
      bitDepth: image.bitDepth,
      alpha: image.alpha === 1,
    };
    // should not happen
  } else if (!Array.isArray(image)) {
    process.env.NODE_ENV !== "production" &&
      console.error("Unrecognized Image.JS.Image type, channels not in [1,3]");
    return {
      shape: ImageShapeEnum.InvalidImage,
    };
  }
  // else RGBstack, or multi-channel, or multi-z-stack image as an ImageJS.Stack object
  else {
    return {
      shape: ImageShapeEnum.HyperStackImage,
      components: image.length,
      bitDepth: image[0].bitDepth,
      alpha: image[0].alpha === 1,
    };
  }
};

/*
 ========================================
 ImageJS <-> ImageType Conversion Helpers
 ========================================
 */

/*
 Receives an image stack, where each elem is an ImageJS.Image object,
 representing an image "frame", in the following order:
 [slice_1_channel_1, slice1_channel2, ..., slice_numSlices_channel_numChannels]

 Each frame of an image stack has a data array
 which is 1D, in row major format
  e.g [r1c1, r1c2, r1c3, r2c1, r2c2, r2c3]
  representing an image of rows = height = 2, cols = width = 3

 March through and form a 2d imageData array of shape [frames, pixels]
  e.g:

  [[ 0, 1, 2, 3, 4, 5],
   [10,11,12,13,14,15],
   [20,21,22,23,24,25],
   [30,31,32,33,34,35],
   [40,41,42,43,44,45],
   [50,51,52,53,54,55]]

 Tensorflow prefers image data to have a shape of [height,width,channels],
 but we cannot simply reshape the 2d matrix above in that way, since the
 data is not ordered such. Instead create 4d tensor of shape:
 [slices,channels,height,width]
 and then transpose into the preffered shape

 The image tensor is of type "float32", wich tensorflow expects to be
 in the range of 0-1, so normalize the tensor with the bitdepth of the
 image, if necessary

 Return the resulting imageTensor
 */
const convertToTensor = (
  imageStack: ImageJS.Stack,
  numSlices: number,
  numChannels: number
): Tensor4D => {
  const { bitDepth, width, height } = imageStack[0];

  const numPixels = height * width;

  // create empty 2d array of expected size
  const imageData = new Float32Array(numSlices * numChannels * numPixels);

  // fill in 2d array with image stack data
  // shape: [numFrames, numPixels]
  for (let i = 0; i < imageStack.length; i++) {
    imageData.set(Float32Array.from(imageStack[i].data), i * numPixels);
  }

  return tidy("stackToTensor", () => {
    // convert to 4d tensor
    // shape: [Z, C, H, W]
    // then permute dims
    // shape: [Z, H, W, C]
    let imageTensor: Tensor4D = tensor4d(imageData, [
      numSlices,
      numChannels,
      height,
      width,
    ]).transpose([0, 2, 3, 1]);

    // normalize in range of 0-1, if not already
    if (!(imageStack[0].data instanceof Float32Array)) {
      const normScalar = scalar(2 ** bitDepth - 1).reciprocal();
      imageTensor = imageTensor.mul(normScalar);
    }

    return imageTensor;
  });
};

/*
  receive image of dims: [Z, H, W, C]
  get slice corresponding to given index
  return image slice with dims: [H, W, C]
 */
const getImageSlice = (imageTensor: Tensor4D, sliceIdx: number): Tensor3D => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, height, width, numChannels] = imageTensor.shape;

  return tidy("getImageSlice", () => {
    return imageTensor
      .slice([sliceIdx], [1, height, width, numChannels])
      .reshape([height, width, numChannels]) as Tensor3D;
  });
};

// filter out channels with visibility true in image colors
const filterVisibleChannels = (colors: Colors): Array<number> => {
  /*
    colors.visible has shape { [channel: boolean]: boolean; }
    Object.entries(colors.visible) produces [string, boolean][],
      e.g. [ ['0', true], ['1', false], ['2', true] ]
    filter out the ones that have true as the value in index 1
    map remaining tuples to the int of the channel number in index 0
    resulting in channel nums that are tagged visible,
      e.g. [0, 2]
   */
  return Object.entries(colors.visible)
    .filter((channelVisible) => channelVisible[1])
    .map((channelVisible) => parseInt(channelVisible[0]));
};

/*
  receive image slice of dims:
    [H, W, C]
  and filter array with channels to include in result
    VC = num_visible_channels = filter.length

  return color filtered image slice of dims:
    [H, W, VC]
 */
const sliceVisibleChannels = (
  imageSlice: Tensor3D,
  filter: Array<number>
): Tensor3D => {
  // channel axis is innermost
  const channelAxis = 2;

  return tidy("sliceVisibleChannels", () => {
    const indices = tensor1d(filter, "int32");

    // form a new 3D tensor, gathering only channels in the indices matching the filter
    // channel axis is innermost, 2
    return imageSlice.gather(indices, channelAxis);
  });
};

/*
  receive image colors containing color matrix of dims:
    [C, 3]
  and filter array with idx of color triples to include in result
    VC = num_visible_channels = filter.length

  return filtered color matrix of dims:
    [VC, 3]
 */
const sliceVisibleColors = (
  colors: Colors,
  filter: Array<number>
): Tensor2D => {
  // channel axis is outermost
  const channelAxis = 0;

  return tidy("sliceVisibleColors", () => {
    const indices = tensor1d(filter, "int32");

    // form a new 2D tensor, gathering only triples in indices matching filter
    return colors.color.gather(indices, channelAxis);
  });
};

/*
  receive image slice (with channels filtered for visibility) of shape:
    [H, W, VC]
  reshape input image slice to shape:
    [pixels, VC]

  e.g. if input image slice of shape [3, 2, 4] is:
  [ [[a, b, c, d],
     [e, f, g, h]],

   [[i, j, k, l],
    [m, n, o, p]],
  
   [[q, r, s, t],
    [u, v, w, x]] ]

  reshape to be of shape [6, 4]:
  [[a, b, c, d],
   [e, f, g, h],
   [i, j, k, l],
   [m, n, o, p],
   [q, r, s, t],
   [u, v, w, x]]

  apply colors to image slice, with colors.color of shape:
    [VC, 3]

  e.g. [4, 3]

  [[r1, g1, b1],
   [r2, g2, b2],
   [r3, g3, b3],
   [r4, g4, b4]]

  resulting in shape [pixels, 3]

  which is reshaped to [height, width, 3] and returned
 */
export const generateColoredTensor = (
  imageSlice: Tensor3D,
  colors: Tensor2D
): Tensor3D => {
  const [height, width, numVisibleChannels] = imageSlice.shape;

  return tidy("generateColoredTensor", () => {
    return (
      imageSlice
        // [pixels, VC]
        .reshape([height * width, numVisibleChannels])
        // [pixels, VC] * [VC, 3] = [pixels, 3]
        .matMul(colors)
        // make sure composite is clamped to proper range for float32
        .clipByValue(0, 1)
        // [H, W, 3]
        .reshape([height, width, 3])
    );
  });
};

/*
  Receives a tensor of shape [H, W, 3]
  returns its base64 data url
 */
const renderTensor = async (compositeTensor: Tensor3D) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [height, width, _] = compositeTensor.shape;
  const imageData = await browser.toPixels(compositeTensor);
  const image = new ImageJS.Image(width, height, imageData);
  // const dataURL = await image.toDataURL("iamge/png", { useCanvas: true });
  const dataURL = image.toDataURL("image/png");
  // TODO: image_data, use Blob instead: https://javascript.info/blob
  return dataURL;
};

export const convertToImage = async (
  imageStack: ImageJS.Stack,
  fileName: string,
  currentColors: Colors | undefined,
  numSlices: number,
  numChannels: number
) => {
  if (!imageStack.length) return;
  // const { bitDepth, width, height } = imageStack[0];

  const colors = currentColors
    ? currentColors
    : generateDefaultChannels(numChannels);

  // image data := create image of dims: [Z, H, W, C]
  const imageTensor = convertToTensor(imageStack, numSlices, numChannels);

  // image slice := get z idx 0 of image with dims: [H, W, C]
  const imageSlice = getImageSlice(imageTensor, 0);

  // get indices of visible channels, VC
  const visibleChannels = filterVisibleChannels(colors);

  // image slice filtered by visible channels: [H, W, VC]
  const filteredSlice = sliceVisibleChannels(imageSlice, visibleChannels);

  // color matrix filtered by visible channels: [VC, 3]
  const filteredColors = sliceVisibleColors(colors, visibleChannels);

  // composite image slice: [H, W, 3]
  const compositeImage = generateColoredTensor(filteredSlice, filteredColors);

  // TODO: image_data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const coloredSliceSrc = await renderTensor(compositeImage);

  // displayData := apply colors to each channel of each z slice
  // calculate min/max values per channel
  // const channelMinMaxValues: Array<Array<number>>
  // set the min max of each channel in each slize, for 8 bit

  // renderedSrc := extract data URI of displayData (or maybe this should occur later?)

  // return image
  return;
};

/*
 ================================
 Image Color Manipulation Helpers
 ================================
 */

export const generateDefaultChannels = (numChannels: number): Colors => {
  const range: { [channel: number]: [number, number] } = {};
  const visible: { [channel: number]: boolean } = {};
  let color: Array<[number, number, number]> = [];

  for (let i = 0; i < numChannels; i++) {
    color.push(
      numChannels > 1 && i < DEFAULT_COLORS.length
        ? DEFAULT_COLORS[i]
        : [1, 1, 1]
    );

    range[i] = [0, 1];

    // if image has more than 3 channels,
    // only show the first channel as default
    // (user can then toggle / untoggle the other channels if desired)
    visible[i] = !(numChannels > 3 && i > 0);
  }

  return {
    range,
    visible,
    color: tensor2d(color, [numChannels, 3], "float32"),
  };
};
