window.onload = function() {
  mapboxgl.accessToken = 'pk.eyJ1IjoiamluZy1zYW0iLCJhIjoiY2l6ZXgxcDA3MDAzbjJ3b3d5c3V0cTdxMSJ9.lncV85QVu9XzKlsOzUf9TA'

  const map = new mapboxgl.Map({
    container: 'map',
    projection: 'EPSG:4490',
    style: style,
    center: [106.52896, 27.9084],
    zoom: 17,
    pitch: 60,
    bearing: 31,
    hash: false
  })
  window.map = map

  popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
  });

  map.on('click', mapClick)

  setTimeout(function() {
    map.easeTo({
      center: [106.53296, 27.91466],
      duration: 20000,
      easing: function(t) {
        return t
      }
    })
  }, 2000)

  map.on('load', () => {
    // map.on('mousemove', mapMouseMove)
    //startAnimate()
    // map.on('mouseenter', 'building_混合', function() {
    //   map.getCanvas().style.cursor = 'pointer';
    // });

    // Change it back to a pointer when it leaves.
    // map.on('mouseleave', 'building_混合', function() {
    //   map.getCanvas().style.cursor = '';
    // });
  })
}

function mapClick(e) {
  var selectThreshold = 2;
  var queryBox = [
    [
      e.point.x - selectThreshold,
      e.point.y + selectThreshold
    ], // bottom left (SW)
    [
      e.point.x + selectThreshold,
      e.point.y - selectThreshold
    ] // top right (NE)
  ];
  var features = map.queryRenderedFeatures(queryBox, { layers: queryLayers }) || [];
  if (!features.length) {
    popup.remove();
    removeHighlight();
  } else {
    hoverHighlight(features[0]);
    popup.setLngLat(e.lngLat)
      .setHTML(renderPopup([features[0]]))
      .addTo(map);
  }
}

function hoverHighlight(feature) {
  if (feature.layer['source-layer'] === 'LAND') {
    //点击院落，高亮院落内的所有建筑物
    let filter = ['in', '隶属宗地', feature.properties['地籍号']];
    map.setFilter('hover_highlight', filter);
  } else {
    let filter = ['in', '$id', feature.id || ''];
    map.setFilter('hover_highlight', filter);
  }
}

function removeHighlight() {
  let filter = ['in', '$id', ''];
  map.setFilter('hover_highlight', filter);
}

function easing(t) {
  return t * (2 - t);
}

function getDistance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y))
}

function getBearing(p1, p2) {
  return Math.atan((p2[0] - p1[0]) / (p2[1] - p1[1])) * 180 / Math.PI
}

function displayValue(value) {
  if (typeof value === 'undefined' || value === null) return value;
  if (typeof value === 'object' ||
    typeof value === 'number' ||
    typeof value === 'string') return value.toString();
  return value;
}

function renderProperty(propertyName, property) {
  /*if (!translate[propertyName]) {
    return
  }*/
  return '<div class="mbview_property">' +
    '<div class="mbview_property-name">' + (translate[propertyName] || propertyName) + '</div>' +
    '<div class="mbview_property-value">' + displayValue(property) + '</div>' +
    '</div>';
}

function renderLayer(layerId) {
  return '<div class="mbview_layer">' + (translate[layerId] || layerId) + '</div>';
}

function renderProperties(feature) {
  var sourceProperty = renderLayer(feature.layer['source-layer'] || feature.layer.source);
  var properties = Object.keys(feature.properties).map(propertyName => {
    return renderProperty(propertyName, feature.properties[propertyName]);
  });
  return [sourceProperty].concat(properties).join('');
}

function renderFeatures(features) {
  return features.map(ft => {
    return '<div class="mbview_feature">' + renderProperties(ft) + '</div>';
  }).join('');
}

function renderPopup(features) {
  let popupFeatures = features
  let feature = popupFeatures[0]
  if (feature.layer['source-layer'] === 'RESA1') { //院落
    let id = feature.properties.ENTIID
    let queryFeatures = map.querySourceFeatures('building', { sourceLayer: 'RESA2', filter: ["==", "GLSTM_RES1", id] })
    let properties = statsYardProperty(queryFeatures)
    popupFeatures[0].properties = properties
  }
  return '<div class="mbview_popup">' + renderFeatures(popupFeatures) + '</div>';
}

function statsYardProperty(features) {
  let elec = 0
  let water = 0
  let gas = 0
  let pop = 0
  let sumedFeatureIds = []
  features.forEach(f => {
    if (sumedFeatureIds.indexOf(f.id) === -1) {
      elec += f.properties.ELECTRIC || 0
      water += f.properties.WATER || 0
      gas += f.properties.GAS || 0
      pop += f.properties.POPULATION || 0
      sumedFeatureIds.push(f.id)
    }
  })

  return {
    POPULATION: pop,
    WATER: water.toFixed(1),
    ELECTRIC: elec.toFixed(1),
    GAS: gas.toFixed(1)
  }
}
