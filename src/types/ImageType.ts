import { Tensor4D } from "@tensorflow/tfjs";
import { BitDepth } from "image-js";
import { Shape, Partition } from "types";
import { Colors } from "./tensorflow";

export type ImageType = {
  activePlane: number;
  categoryId: string;
  colors: Colors;
  bitDepth: BitDepth;
  id: string;
  name: string;
  shape: Shape;
  data: Tensor4D; // [Z, H, W, C]
  partition: Partition;
  visible: boolean;
  src: string; // The URI to be displayed on the canvas
};

export type ImageAttributeType = keyof ImageType;
