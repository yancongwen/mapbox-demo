let style = {
  "version": 8,
  "bearing": 0,
  "pitch": 0,
  "sources": {
    "composite": {
      "tiles": ["https://t0.tianditu.com/img_w/wmts?service=wmts&request=gettile&version=1.0.0&layer=img&style=default&TileMatrixSet=w&TileMatrix={z}&TileCol={x}&tileRow={y}"],
      "type": "raster",
      "tileSize": 256
    },
    "label": {
      "tiles": ["https://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&Layer=cva&Style=default&TileMatrixSet=w&TileMatrix={z}&TileCol={x}&TileRow={y}"],
      "type": "raster",
      "tileSize": 256
    }
  },
  "sprite": "mapbox://sprites/wanyanyan/cj528ezlv21gs2slc4iruj0zk",
  "glyphs": "mapbox://fonts/wanyanyan/{fontstack}/{range}.pbf",
  "layers": [{
    "id": "底图",
    "type": "raster",
    "source": "composite",
    "layout": {},
    "paint": {}
  },
  {
    "id": "注记",
    "type": "raster",
    "source": "label",
    "layout": {},
    "paint": {}
  }]
}
window.onload = function () {
  mapboxgl.accessToken = 'pk.eyJ1Ijoid2FueWFueWFuIiwiYSI6Im1uNVZnTncifQ.90XY40_yjpItUHO8HnbbpA';
  var map = new mapboxgl.Map({
    container: 'map',
    zoom: 16,
    center: [120.2, 30.2],
    style: style,
    hash: false,
    maxTileCacheSize: 100,
    attributionControl: false
  });
  window.map = map;
  map.on('load', () => {
    $.get('./data/new_line.json', (data, res) => {
      let lines = data.features;
      let co = lines[0].geometry.coordinates;
      var tds = document.getElementsByTagName('td');
      var feature = turf.lineString([co[0], co[1]]);        // 第一个点
      var collection = turf.featureCollection([feature]);
      map.addSource('trace', { type: 'geojson', data: collection });
      map.addLayer({
        "id": "trace",
        "type": "line",
        "source": "trace",
        "paint": {
          "line-color": "yellow",
          "line-opacity": 0.75,
          "line-width": 5
        }
      });
      map.jumpTo({ 'center': co[1], 'zoom': 16 });
      map.setPitch(30);
      var lineIndex = 0;
      var pointIndex = 1;
      updateHTML();
      var timer = window.setInterval(function() {
        if (pointIndex === lines[lineIndex].geometry.coordinates.length - 1) {
          console.log(pointIndex)
          pointIndex = 1;
          lineIndex++;
          if (lineIndex === lines.length) {
            clearInterval(timer);
            return;
          }
          updateHTML();
          let newLine = turf.lineString([lines[lineIndex].geometry.coordinates[pointIndex - 1], lines[lineIndex].geometry.coordinates[pointIndex]]);
          collection.features.push(newLine);
          map.getSource('trace').setData(collection);
          map.panTo(lines[lineIndex].geometry.coordinates[pointIndex], {duration: 3000});
        } else {
          pointIndex++;
          let lastFeature = collection.features[collection.features.length - 1];
          lastFeature.geometry.coordinates.push(lines[lineIndex].geometry.coordinates[pointIndex]);
          map.getSource('trace').setData(collection);
          map.panTo(lines[lineIndex].geometry.coordinates[pointIndex]);
        }
      }, 100);

      function updateHTML() {
        var properties = lines[lineIndex].properties;
        var time = new Date(+properties.po_time);
        tds[1].innerText = properties.id;
        tds[3].innerText = properties.user_name;
        tds[5].innerText = properties.org_name;
        tds[7].innerText = time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日';
        tds[9].innerText = properties.phone;
      }
    })
    
  })
  
}