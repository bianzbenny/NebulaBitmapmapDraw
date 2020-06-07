import React, { useState } from "react";
import DeckGL from "@deck.gl/react";
import { OrthographicView, OrbitView, COORDINATE_SYSTEM } from "@deck.gl/core";
import { BitmapLayer } from "@deck.gl/layers";
import boundingBoxLayer from "./boundingbox";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { Toolbox } from "@nebula.gl/editor";
import { ViewMode } from "@nebula.gl/edit-modes";
import center_zoom from "./utils";
/* import { StaticMap } from 'react-map-gl';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA';
 */
/* const initialViewState = {
  longitude: -122.43,
  latitude: 37.775,
  zoom: 12,
}; */

export default function() {
  //const [min, max] = [[-122.519, 37.7045], [-122.355, 37.829]];
  const [min, max] = [[0, 0], [199000, 154000]];
  const [width, height] = [800, 600];
  const { scale, zoom, target } = center_zoom({ min, max, width, height });
  console.log(`zoom: ${zoom} target: ${target}`);
  //const [longitude, latitude] = [-122.431297, 37.773972];
  const [viewport] = useState({
    target, //: [longitude, latitude, 0], //world coords of view center, should be bbox center
    //position: [longitude, latitude, 0],
    /* latitude: 37.773972,
    longitude: -122.431297,
    pitch: 50,
    bearing: 0, */
    zoom,
    width,
    height,
    rotationX: 0
  });

  //create different views 2d, or 3d
  let v2d = true;
  const views2d = new OrthographicView({ id: "2d-scene" });
  const views3d = new OrbitView({
    id: "3d-scene",
    orbitAxis: "X",
    rotationX: 0
  });
  const [features, setFeatures] = React.useState({
    type: "FeatureCollection",
    features: []
  });
  const [selectedFeatureIndexes] = React.useState([]);
  const [mode, setMode] = React.useState(() => ViewMode);

  const layer = new EditableGeoJsonLayer({
    data: features,
    mode,
    selectedFeatureIndexes,
    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
    }
  });
  const bitmapLayer = new BitmapLayer({
    bounds: [...min, ...max],
    image:
      "https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/sf-districts.png",
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    desaturate: 0,
    transparentColor: [0, 0, 0, 0],
    tintColor: [255, 255, 255]
  });

  const layers = [boundingBoxLayer({ min, max }), bitmapLayer, layer];

  return (
    <>
      <div>Nebula.gl bitmap as base map with x, y coordinateSystem</div>
      <DeckGL
        initialViewState={viewport}
        views={views2d}
        controller={{
          doubleClickZoom: false
        }}
        layers={layers}
        getCursor={layer.getCursor.bind(layer)}
      >
        {/* <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} /> */}
      </DeckGL>
      <Toolbox
        mode={mode}
        features={features}
        onSetMode={setMode}
        onImport={featureCollection =>
          setFeatures({
            ...features,
            features: [...features.features, ...featureCollection.features]
          })
        }
      />
    </>
  );
}
