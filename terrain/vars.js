var style = {
  "version": 8,
  "sources": {
    "img_w": {
      "type": "raster",
      "tiles": ["http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}"],
      "tileSize": 256
    },
    "mapbox-terrain-rgb": {
      "type": "raster-dem",
      "url": "mapbox://mapbox.terrain-rgb"
    }
  },
  "layers": [
    {
      "id": "img_w",
      "type": "raster",
      "source": "img_w"
    },
    {
      "id": "hillshading",
      "source": "mapbox-terrain-rgb",
      "type": "hillshade"
    }
  ]
}