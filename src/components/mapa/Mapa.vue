<template>
  <l-map ref="myMap" 
      style="height: 400px; "
       :zoom="zoom"
        :center="center"
      :options="mapOptions"
      @click="addMarker"
  > 
   <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
    <l-layer-group ref="popz">
        <l-popup> 
            <div style="min-height: 60px; display:flex !important; justify-content:center !important" >
              <transition-group
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >   
        <div key="contenido">            
            <p v-show="direccionCargada">{{direccionSeleccionada.LongLabel}}  </p>            
        </div>
              </transition-group>
              
              <q-inner-loading style="top: -30px !important"  :showing="!direccionCargada">
                <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>
                </div>
             <q-separator inset />

             <q-btn flat color="secondary" label="Programar Partido" @click="obtenerDireccion" />
        </l-popup>  
    </l-layer-group>

    <l-marker v-for="marker, index in markers" :lat-lng="marker" :key="index" @click="removeMarker(index)">
     </l-marker>
      
  </l-map>
  
</template>
<script>
import L, { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LPopup, LLayerGroup } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import Axios from 'axios';
import {parseString} from 'xml2js';
import * as esri from 'esri-leaflet'
import * as geocoder from 'esri-leaflet-geocoder';
import LeafletSearch from "leaflet-search";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { GeoSearchControl } from "leaflet-geosearch";


delete Icon.Default.prototype._getIconUrl;
Icon.Default.imagePath = '.';
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  //iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconUrl: require('components/mapa/Marcador/Marcador.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
    name: 'Mapa',
    components: { LMap, LTileLayer, LMarker, LPopup, LLayerGroup }    ,
    data(){
        return{
            zoom: 13,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            center: [3.43722, -76.5225],
            ubicacionPopup: [3.43722, -76.5225],
            direccionSeleccionada:{},
            mapOptions: {
                zoomSnap: 0.5
            },
            attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            markers:[],
            //POPUP 
            direccionCargada: false,
            //POPUP
            
            
        }
    },
    mounted(){
        /* var parentContainer = this.findRealParent(this.$parent);
        console.log(this.$parent) */

        const provider = new OpenStreetMapProvider();
        const map = this.$refs.myMap.mapObject;        
        /* const searchControl =  new L.Control.Search({
            url: "https://nominatim.openstreetmap.org/search?format=json&q={s}",
            jsonpParam: "json_callback",
            propertyName: "display_name",
            propertyLoc: ["lat", "lon"],
            marker: L.circleMarker([0, 0], { radius: 30 }),
            autoCollapse: true,
            autoType: true,
            minLength: 2
        }) */
        const searchControl = new GeoSearchControl({
    provider: provider,
    // ... some more options
  });
        console.log(searchControl)
        map.addControl(searchControl);
        
    },
    methods:{
         leafletSearcInit() {
            LeafletSearch;
        },
        doSomethingOnReady(){
            
             this.map = this.$refs.myMap.mapObject
             console.log(this.map)
        },
            removeMarker(index) {
        this.markers.splice(index, 1);
        },
        findRealParent(firstVueParent) {
            let found = false;
            while (firstVueParent && !found) {
                if (firstVueParent.mapObject === undefined) {
                firstVueParent = firstVueParent.$parent;
                } else {
                found = true;
                }
            }
            return firstVueParent;
            },
        addMarker(event) {            
            //this.obtenerDireccion(event.latlng);
            this.obtenerDireccion(event.latlng)            
            this.$refs.popz.mapObject.openPopup(event.latlng)
        //this.markers.push(event.latlng);        

        },
        obtenerDireccion(ltlg){
           //var geocode= esri.Geocoding.geocodeService();
           console.log("ejecutado")
           this.direccionCargada = false;     
           var geocode = geocoder.geocodeService();
           geocode.reverse().latlng(ltlg).run((error, result) =>{
               console.log(result.address)
               this.direccionSeleccionada = result.address
               this.direccionCargada = true;        
           })
        },
       
     

         
    }
}
</script>