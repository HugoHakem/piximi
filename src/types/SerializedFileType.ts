import { SerializedAnnotationType } from "./SerializedAnnotationType";
import { Color } from "./Color";

// TODO: image_data
export type SerializedFileType = {
  imageChannels: number;
  imageColors: Array<Color>;
  imageData: Array<Array<string>>;
  imageSrc: string;
  imageFilename: string;
  //imageFrames: number;
  imageHeight: number;
  imageId: string;
  imagePlanes: number;
  imageWidth: number;
  annotations: Array<SerializedAnnotationType>;
};
