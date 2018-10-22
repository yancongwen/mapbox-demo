new Vue({
  el: '#app',
  data: {
    options: {
      'hillshade-illumination-direction': 335,
      'hillshade-exaggeration': 0.5,
      'hillshade-shadow-color': '#000000',
      'hillshade-highlight-color': '#ffffff',
      'hillshade-accent-color': '#000000'
    }
  },
  methods: {
    optionChange(key, value) {
      this.options[key] = value
      map.setPaintProperty('hillshading', key, value)
    }
  },
  mounted() {
    window.onload = () => {
      mapboxgl.accessToken = 'pk.eyJ1IjoiamluZy1zYW0iLCJhIjoiY2l6ZXgxcDA3MDAzbjJ3b3d5c3V0cTdxMSJ9.lncV85QVu9XzKlsOzUf9TA'

      const map = new mapboxgl.Map({
        container: 'map',
        style: style,
        center: [119.58398,29.82895],
        zoom: 10,
        pitch: 0,
        hash: false
      })
      window.map = map
      popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false
      });
    }
  }
})
