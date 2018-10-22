const translate = {}
const queryLayers = ["building_其他", "building_混合", "building_砖木", "building_简易", "building_砼", "yard_fill"]

var style = {
  "version": 8,
  "sources": {
    "img_c": {
      "type": "raster",
      "tiles": ["http://t0.tianditu.com/vec_c/wmts?service=wmts&request=gettile&version=1.0.0&layer=vec&style=default&TileMatrixSet=c&TileMatrix={z}&TileCol={x}&tileRow={y}"],
      "tileSize": 256
    },
    "label_c": {
      "type": "raster",
      "tiles": ["http://t0.tianditu.com/cva_c/wmts?service=wmts&request=gettile&version=1.0.0&layer=cva&style=default&TileMatrixSet=c&TileMatrix={z}&TileCol={x}&tileRow={y}"],
      "tileSize": 256
    },
    "building": {
      "type": "vector",
      "url": "http://127.0.0.1:3000/api/v1/tilesets/DIJI-XTZ/tilejson"
    }
  },
  "layers": [{
      "id": "img_c",
      "type": "raster",
      "source": "img_c",
      "maxzoom": 22
    },
    {
      "id": "label_c",
      "type": "raster",
      "source": "label_c",
      "maxzoom": 22
    },
    {
      "id": "admin",
      "type": "line",
      "source": "building",
      "source-layer": "BOUA",
      "paint": {
        "line-color": "#0000ff",
        "line-width": 2
      }
    },
    {
      "id": "yard",
      "type": "line",
      "source": "building",
      "source-layer": "LAND",
      "paint": {
        "line-color": "#ff0000",
        "line-width": 2
      }
    },
    {
      "id": "yard_fill",
      "type": "fill",
      "source": "building",
      "source-layer": "LAND",
      "paint": {
        "fill-color": "#ff0000",
        "fill-opacity": 0.2
      }
    },
    {
      "id": "building_混合",
      "type": "fill-extrusion",
      "filter": ["in", "房屋结构", "4"],
      "source": "building",
      "source-layer": "HOUSE",
      "paint": {
        "fill-extrusion-color": "#4daf4a",
        "fill-extrusion-height": ['*', ['to-number', ['get', '房屋层数']], 3],
        "fill-extrusion-opacity": 1
      }
    },
    {
      "id": "building_砖木",
      "type": "fill-extrusion",
      "filter": ["in", "房屋结构", "5"],
      "source": "building",
      "source-layer": "HOUSE",
      "paint": {
        "fill-extrusion-color": "#ff7f00",
        "fill-extrusion-height": ['*', ['to-number', ['get', '房屋层数']], 3],
        "fill-extrusion-opacity": 1
      }
    },
    {
      "id": "building_简易",
      "type": "fill-extrusion",
      "filter": ["in", "房屋结构", "6"],
      "source": "building",
      "source-layer": "HOUSE",
      "paint": {
        "fill-extrusion-color": "#377eb8",
        "fill-extrusion-height": ['*', ['to-number', ['get', '房屋层数']], 3],
        "fill-extrusion-opacity": 1
      }
    },
    {
      "id": "building_砼",
      "type": "fill-extrusion",
      "filter": ["in", "房屋结构", "砼"],
      "source": "building",
      "source-layer": "HOUSE",
      "paint": {
        "fill-extrusion-color": "#ffff33",
        "fill-extrusion-height": ['*', ['to-number', ['get', '房屋层数']], 3],
        "fill-extrusion-opacity": 1
      }
    },
    {
      "id": "building_其他",
      "type": "fill-extrusion",
      "filter": ["!in", "房屋结构", "4", "5", "6", "砼"],
      "source": "building",
      "source-layer": "HOUSE",
      "paint": {
        "fill-extrusion-color": "#aaaaaa",
        "fill-extrusion-height": ['*', ['to-number', ['get', '房屋层数']], 3],
        "fill-extrusion-opacity": 1
      }
    },
    {
      // 这个图层数据和上面图层一模一样，仅仅是为了高亮显示建筑物而添加
      'id': 'hover_highlight',
      "type": "fill-extrusion",
      "filter": ['in', '$id', ''],
      "source": "building",
      "source-layer": "HOUSE",
      "paint": {
        "fill-extrusion-color": "#ff0000",
        "fill-extrusion-height": ['*', ['to-number', ['get', '房屋层数']], 3],
        "fill-extrusion-opacity": 1
      }
    }
  ]
}
