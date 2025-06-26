import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

import topojson from "../../Assets/IND_adm1.json"
 const geoUrl = topojson
  //"https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

  const geographyStyle = {
    default: {
      outline: '1px'
    },
    hover: {
      fill: '#ccc',
      transition: 'all 250ms',
      outline: 'none'
    },
    pressed: {
      outline: 'none'
    }
  };

const MapChart = () => {
  
    return (
        <ComposableMap
        projection="geoMercator"
        projectionConfig={{
        //  rotate: [58, 20, 0],
        //  scale: 400
        scale:420,
        center: [78.9629, 22.5937]
        }}
        width={600}
        height={320}
        
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
            //  .filter(d => d.properties.ISO_A3 === "IND")
              .map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  
                  fill="#DDD"
                  stroke="#FFF"
                  strokeWidth={0.5} 
                  style={geographyStyle}
                />
              ))
          }
        </Geographies>

      </ComposableMap>

    );
  };
  
  export default MapChart;