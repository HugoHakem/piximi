import React from "react";
import { useSelector } from "react-redux";
import * as ReactKonva from "react-konva";

import { useMarchingAnts } from "hooks";

import { EllipticalAnnotationTool } from "annotator-tools";
import { imageOriginSelector, stageScaleSelector } from "store/imageViewer";

type EllipticalSelectionProps = {
  operator: EllipticalAnnotationTool;
};

export const EllipticalSelection = ({ operator }: EllipticalSelectionProps) => {
  const dashOffset = useMarchingAnts();
  const imageOrigin = useSelector(imageOriginSelector);
  const stageScale = useSelector(stageScaleSelector);
  if (!operator.center || !operator.radius) return null;

  const x = operator.center.x + imageOrigin.x;
  const y = operator.center.y + imageOrigin.y;

  return (
    <>
      <ReactKonva.Group>
        <ReactKonva.Ellipse
          dash={[4 / stageScale, 2 / stageScale]}
          dashOffset={-dashOffset}
          radiusX={operator.radius.x}
          radiusY={operator.radius.y}
          stroke="black"
          strokeWidth={1 / stageScale}
          x={x}
          y={y}
        />
        <ReactKonva.Ellipse
          dash={[4 / stageScale, 2 / stageScale]}
          dashOffset={-dashOffset}
          radiusX={operator.radius.x}
          radiusY={operator.radius.y}
          stroke="white"
          strokeWidth={1 / stageScale}
          x={x}
          y={y}
        />
      </ReactKonva.Group>
    </>
  );
};
