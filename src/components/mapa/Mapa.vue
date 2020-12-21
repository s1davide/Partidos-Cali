<template>
  <l-map ref="myMap" 
      style="height: 400px"
       :zoom="zoom"
        :center="center"
      :options="mapOptions"
  > 
   <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
        <l-marker :lat-lng="withPopup">
     
      </l-marker>
  </l-map>
</template>
<script>
import L from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.imagePath = '.';
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
    name: 'Mapa',
    components: { LMap, LTileLayer, LMarker }    ,
    data(){
        return{
            zoom: 13,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            center: [3.43722, -76.5225],
            withPopup: [47.41322, -1.219482],
            mapOptions: {
                zoomSnap: 0.5
            },
            attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }
    },
    mounted(){
    },
    methods:{
        doSomethingOnReady(){
            console.log("hey")
             this.map = this.$refs.myMap.mapObject
             console.log(this.map)
        },
         
    }
}
</script>