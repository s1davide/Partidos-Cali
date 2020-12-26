<template>
  <l-map ref="myMap" 
      style="height: 400px; "
       :zoom="zoom"
        :center="center"
      :options="mapOptions"      
      @click="abrirPopup"
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
            <p v-show="direccionCargada">{{direccionSeleccionada}}  </p>            
        </div>
              </transition-group>
              
              <q-inner-loading style="top: -30px !important"  :showing="!direccionCargada">
                <q-spinner-gears size="50px" color="primary" />
                </q-inner-loading>
                </div>
             <q-separator inset />

             <q-btn flat color="secondary" label="Programar Partido" @click="abrirPopup" />
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
import * as easyButton from 'leaflet-easybutton'
import {SearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import LGeosearch from "vue2-leaflet-geosearch";
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'


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
    components: { 
        LMap, LTileLayer, LMarker, LPopup, LLayerGroup, LGeosearch
    },
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
            //
            
            
        }
    },
    mounted(){
        let map =this.$refs.myMap.mapObject;
        const searchControl = new geocoder.Geosearch().addTo(map)                
        const results = new L.LayerGroup().addTo(map);
        searchControl.on('results', (data)=>{
            this.buscarDireccion(data)
            results.clearLayers();                            
        }); 
        L.easyButton('<i class="material-icons" style="font-weight: bold; font-size: 18px" title="Restaurar Mapa">close</i>', function(btn, map){          
            self.restaurarMapa();      
        }).addTo(map);
        let self = this;
        L.easyButton('<i class="material-icons" style=" font-size: 18px" title="Restaurar Mapa">gps_fixed</i>', function(btn, map){ 
            let localizacion =false;  
            self.obtenerUbicacionUsuario();
        }).addTo(map);

    },
    methods:{
        removeMarker(index) {
            this.markers.splice(index, 1);
        },
        obtenerUbicacionUsuario(){
            let self = this;
            let map =this.$refs.myMap.mapObject;
            let lat ;
            let lng;
            let ubicacion={};
            let mensajeError = "Debes permitir tu ubicación en el explorador"
            if (navigator.geolocation) {       
                navigator.permissions.query({name:'geolocation'}).then(function(result) {
                    if (result.state == 'granted') {
                        navigator.geolocation.getCurrentPosition(function(position) {            
                            lat = position.coords.latitude;
                            lng = position.coords.longitude
                            ubicacion = {lat: lat,lng: lng}
                            map.flyTo([lat, lng], 17) ;                            
                            self.abrirPopup(ubicacion)  
                        })               
                    } else if (result.state == 'prompt') {                           
                        navigator.geolocation.getCurrentPosition(function(position) {                            
                            lat = position.coords.latitude;
                            lng = position.coords.longitude
                            ubicacion = {lat: lat,lng: lng}
                            map.flyTo([lat, lng], 17) ;                            
                            self.abrirPopup(ubicacion)                              
                        },(r)=>{self.notificacion(mensajeError, 'negative', 'mood_bad');})
                    } else if (result.state == 'denied') {                           
                            self.notificacion(mensajeError, 'negative', 'mood_bad');
                    }
                })
            }
        },
        notificacion(mensaje, color, icon){
            this.$q.notify({
                message: mensaje,
                color: color,
                icon: icon,
                position: 'top',
                timeout: 200
            })
        },        
        abrirPopup(ltlg){            
           let ubicacion = ltlg.latlng;
           this.direccionCargada = false;     
           var geocode = geocoder.geocodeService();
           this.$refs.popz.mapObject.openPopup(ubicacion)
           geocode.reverse().latlng(ubicacion).run((error, result) =>{ 
                if(result.address.City!="Cali"){
                    let mensaje = 'Solo puedes crear partidos en Cali';
                    this.notificacion(mensaje, 'negative', 'mood_bad')
                    this.restaurarMapa()
                }else{
                    let resultado= result;
                    this.direccionSeleccionada = ltlg.text!=undefined?ltlg.text: result.address.LongLabel
                    this.direccionCargada = true;      
                }                                                        
           })
        },       
        buscarDireccion(value){            
            this.abrirPopup(value)                                 
        }, 
        restaurarMapa(){
            let map =this.$refs.myMap.mapObject;
            this.$refs.popz.mapObject.closePopup();
            map.flyTo([3.43722, -76.5225], 13)      
        }
    }
}
</script>
<style>
    .easy-button-button{
        background-color: white ;
        padding: 0;
        outline: none;
        border:none;
        width: 30px;
        height: 30px;
        transition: all .2s;
    }
    .easy-button-button:hover{
        background-color: #f4f2f2;   
    }
</style>