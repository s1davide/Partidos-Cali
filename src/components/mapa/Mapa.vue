<template>    
        <l-map ref="myMap" 
            style="height: 94vh; "
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
                    <div style="display: flex; justify-content:center;">
                        <q-btn flat color="secondary" label="Programar Partido" @click="funcionCrearPartido(direccionSeleccionada)" />
                    </div> 
                </l-popup>  
            </l-layer-group>    
            <l-layer-group  style="min-width: 250px" ref="popInfoPartido">
                <l-popup  style="min-width: 250px"> 
                    <div style="min-height: 60px; display:flex !important; justify-content:center !important" >
                    
                        <div key="contenido" class="column text-center">  
                            <p class="text-center"><strong>{{partidoSeleccionado.nombrePartido}}</strong></p>          
                            <p>Creado por: {{partidoSeleccionado.usuario}}</p>          
                            <p>Info Ubicación: {{partidoSeleccionado.direccion}} </p>
                            <p>Fecha: {{partidoSeleccionado.fecha}} </p>      
                            <p>Nro Asistentes: {{partidoSeleccionado.asistentes.length}} de {{partidoSeleccionado.maximoAsistentes}}</p>             
                            <strong v-if="partidoSeleccionado.asistentes.find(a=>a.email==informacionUsuario.email)!=undefined && informacionUsuario.email!=partidoSeleccionado.email" class="text-positive">
                                Estas en este partido</strong>
                            <strong v-if="informacionUsuario.email==partidoSeleccionado.email" class="text-positive">Creaste este Partido</strong>
                            <q-btn v-if="sesionIniciada" color="primary" flat no-caps>
                            <div>Ingresar al Chat</div>
                                <q-icon     
                                    class="q-ml-sm"
                                    name="message"
                                    color="primary"
                                    />
                                </q-btn>
                        </div>
                        </div>
                    <!-- <q-separator inset /> -->
                    <div style="display: flex; justify-content:center;">
                    <q-btn  
                    v-if="informacionUsuario.email!=partidoSeleccionado.email && 
                    partidoSeleccionado.asistentes.length<partidoSeleccionado.maximoAsistentes &&
                    partidoSeleccionado.asistentes.find(a=>a.email==informacionUsuario.email)==undefined && sesionIniciada"  
                    color="positive" flat no-caps
                    @click="irAPartido">
                        <div>Ir al partido</div>
                        <q-icon   
                            class="q-ml-sm"
                            name="sports_soccer"
                            color="positive"
                            />
                    </q-btn>
                    <q-btn  
                    v-if="informacionUsuario.email!=partidoSeleccionado.email &&                     
                    partidoSeleccionado.asistentes.find(a=>a.email==informacionUsuario.email)!=undefined && sesionIniciada"    
                    
                    color="negative" flat no-caps
                    @click="NoirAPartido">
                        <div>No ir al partido</div>
                        <q-icon   
                            class="q-ml-sm"
                            name="sports_soccer"
                            color="negative"
                            />
                    </q-btn>
                    </div> 
                </l-popup>  
            </l-layer-group>    
            <l-marker v-for="(partido, id, index) in partidos" :lat-lng="partido.ubicacion" :key="index" @click="popupInfoPartido(partido, id)">
            </l-marker>      
        </l-map>
        
    
</template>
<script>
import L, { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker, LPopup, LLayerGroup, LPolygon } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import Axios from 'axios';
import { parseString } from 'xml2js';
import * as esri from 'esri-leaflet'
import * as geocoder from 'esri-leaflet-geocoder';
import * as easyButton from 'leaflet-easybutton'
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'
import * as valle from 'src/components/mapa/Polygon/Valle'
import {mapState, mapMutations} from 'vuex'

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
        LMap, LTileLayer, LMarker, LPopup, LLayerGroup
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
            ///Intancias mapa////////
            mapa: undefined,
            poligon: undefined,
            ///Intancias mapa////////                       
            partidos: {},
            partidoSeleccionado:{asistentes: []}
        }
    },
    mounted(){
        this.mapa =this.$refs.myMap.mapObject;                
        this.notificacion = this.plugins.notificacion;
        let buscar = this.organizarGeojson(valle.caliPolygon[0]) ;          
        const searchControl = new geocoder.Geosearch({
            useMapBounds: false,
            zoomToResult: true,
            allowMultipleResults: true,
            searchMode: 'contain',
            searchBounds: buscar
        }).addTo(this.mapa)                
        const results = new L.LayerGroup().addTo(this.mapa);
        searchControl.on('results', (data)=>{
            this.buscarDireccion(data);            
            results.clearLayers();                            
        }); 
        L.easyButton('<i class="material-icons" style="font-weight: bold; font-size: 18px" title="Restaurar Mapa">close</i>', function(btn, map){          
            self.restaurarMapa();      
        }).addTo(this.mapa);
        let self = this;
        L.easyButton('<i class="material-icons" style=" font-size: 18px" title="Restaurar Mapa">gps_fixed</i>', function(btn, map){ 
            let localizacion =false;  
            self.obtenerUbicacionUsuario();
        }).addTo(this.mapa);
        ///////////////////////////////////conexion con firebase///////////////////////////////////
        var refDbPartidos = this.$firebase.database().ref('partidos/')
        refDbPartidos.on('value', (snapshot)=>{
            this.partidos = snapshot.val();                        
            let objPartidos = {partidos: snapshot.val()}
            let actualizarInfoPartido;
            let idPartidoActual = this.partidoSeleccionado.idPartido
            if(this.partidoSeleccionado.idPartido!=undefined){
                actualizarInfoPartido= objPartidos.partidos[idPartidoActual];
                this.partidoSeleccionado={
                    idPartido: idPartidoActual,
                    nombrePartido: actualizarInfoPartido.nombre,
                    usuario: actualizarInfoPartido.usuario,                
                    direccion: actualizarInfoPartido.direccion,
                    fecha: actualizarInfoPartido.fecha,
                    asistentes: actualizarInfoPartido.asistentes,
                    maximoAsistentes: actualizarInfoPartido.maximoAsistentes,
                    email: actualizarInfoPartido.email
                }                
            }
            
        })
        ///////////////////////////////////conexion con firebase///////////////////////////////////
    },
    methods:{
        
        ///////////////////////////////////////////Funcionalidades del mapa/////////////////////////////////////////////////////
        
        obtenerUbicacionUsuario(){
            let self = this;            
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
                            self.mapa.flyTo([lat, lng], 17) ;                            
                            self.ab(ubicacion)  
                        })               
                    } else if (result.state == 'prompt') {                           
                        navigator.geolocation.getCurrentPosition(function(position) {                            
                            lat = position.coords.latitude;
                            lng = position.coords.longitude
                            ubicacion = {lat: lat,lng: lng}
                            self.mapa.flyTo([lat, lng], 17) ;                            
                            self.abrirPopup(ubicacion)                              
                        },(r)=>{self.notificacion(mensajeError, 'negative', 'mood_bad',200);})
                    } else if (result.state == 'denied') {                           
                            self.notificacion(mensajeError, 'negative', 'mood_bad',200);
                    }
                })
            }
        },
             
        abrirPopup(ltlg){
           let ubicacion = ltlg.latlng
           var geocode = geocoder.geocodeService();           
           this.polygon!=undefined?this.mapa.removeLayer(this.polygon):undefined;
           this.$refs.popz.mapObject.openPopup(ubicacion)
           this.mapa.flyTo([ubicacion.lat, ubicacion.lng], 17)   
           geocode.reverse().latlng(ubicacion).run((error, result) =>{                
                if(result.address.City!="Cali"){
                    let mensaje = 'Solo puedes crear partidos en Cali';
                    this.polygon!=undefined?this.mapa.removeLayer(this.polygon):undefined;
                    this.notificacion(mensaje, 'negative', 'mood_bad',200)
                    this.restaurarMapa()
                }else{                                        
                    this.direccionSeleccionada = ltlg.text!=undefined?ltlg.text: result.address.LongLabel
                    this.setInformacionPartido({
                        latlng: ubicacion,
                        direccion: this.direccionSeleccionada
                    });
                    this.direccionCargada = true;      
                }                                                        
           })
        },  
        buscarDireccion(value){                  
            let resultado = value.results;                        
            resultado.length>0?this.obtenerInfoPoligono(resultado[0].latlng):this.reintentarBusqueda(value);            
        }, 
        obtenerInfoPoligono(coordenadas){
            this.$axios.get(
                    `https://nominatim.openstreetmap.org/reverse?format=json&polygon_geojson=1&lat=${coordenadas.lat}&lon=${coordenadas.lng}`).then((res)=>{                          
                        let latlng =  {latlng:{lat: res.data.lat, lng: res.data.lon} }  
                        this.abrirPopup(latlng);
                        this.dibujarPoligono(res.data.geojson);                       
                })
        },
        dibujarPoligono(coordenadas){               
                    if(coordenadas.type=="Polygon"){
                        let lng = this.organizarGeojson(coordenadas.coordinates[0]);
                        this.polygon!=undefined?this.mapa.removeLayer(this.polygon):undefined;
                        this.polygon = L.polygon(lng, {color:'blue'}).addTo(this.mapa);                   
                    }
                    else if(coordenadas.type=="Point"){
                        let lng = this.organizarGeojson([coordenadas.coordinates])[0];                        
                        this.polygon!=undefined?this.mapa.removeLayer(this.polygon):undefined;
                        this.polygon = L.circle(lng, {color:'blue', radius: 8}).addTo(this.mapa);                           
                    }
                    else{
                        let lng =  this.organizarGeojson(coordenadas.coordinates)
                        this.polygon!=undefined?this.mapa.removeLayer(this.polygon):undefined;
                        this.polygon = L.polygon(lng, {color:'blue'}).addTo(this.mapa);
                    }                             
        },
        reintentarBusqueda(resInicial){
            let query = resInicial.text.split(",");            
            this.$axios.get
            (`https://nominatim.openstreetmap.org/search?q=${query[0]} ${query[2]} ${query[3]}&format=json&polygon_geojson=1&addressdetails=1`)
            .then((res)=>{
                if(res.data.length>0){                                                     
                    let latlng =  {latlng:{lat: res.data[0].lat, lng: res.data[0].lon}}
                    this.abrirPopup(latlng);
                    this.dibujarPoligono(res.data[0].geojson)                    
                }
                else{                    
                    this.notificacion("No se encontraron coincidencias", 'negative', 'mood_bad',200)
                }
                
            })            
        },
        restaurarMapa(){            
            this.$refs.popz.mapObject.closePopup();
            this.mapa.flyTo([3.43722, -76.5225], 13)                  
        },
        organizarGeojson(geoJson){
            let geoJsonOrganizado = geoJson.map((x)=>{
            let organizado = [x[1],x[0]]
            return organizado})    
            return   geoJsonOrganizado;
        },
        popupInfoPartido(infoPartido, id){
            let latlng = infoPartido.ubicacion
            
            this.partidoSeleccionado ={
                idPartido: id,
                nombrePartido: infoPartido.nombre,
                usuario: infoPartido.usuario,                
                direccion: infoPartido.direccion,
                fecha: infoPartido.fecha,
                asistentes: infoPartido.asistentes,
                maximoAsistentes: infoPartido.maximoAsistentes,
                email: infoPartido.email
            }
            this.$refs.popInfoPartido.mapObject.openPopup(latlng)
            
        },
        irAPartido(){
            //this.partidoSeleccionado
            var refDbPartidos = this.$firebase.database().ref()
            let updates = {}
            this.partidoSeleccionado.asistentes.push({
                nombreUsuario: this.informacionUsuario.nombreUsuario,
                        email :this.informacionUsuario.email})
            updates[`partidos/${this.partidoSeleccionado.idPartido}/asistentes`] = this.partidoSeleccionado.asistentes            
            refDbPartidos.update(updates)
        },
        NoirAPartido(){
            var refDbPartidos = this.$firebase.database().ref()
            let updates = {}
            this.partidoSeleccionado.asistentes=this.partidoSeleccionado.asistentes.filter(val=>val.email!=this.informacionUsuario.email)
            updates[`partidos/${this.partidoSeleccionado.idPartido}/asistentes`] = this.partidoSeleccionado.asistentes            
            refDbPartidos.update(updates)
        },
        ///////////////////////////////////////////Funcionalidades del mapa/////////////////////////////////////////////////////
        ...mapMutations('elementosPublicos',['setInformacionPartido']),        

    },
    computed:{
        ...mapState('elementosPublicos',['funcionCrearPartido']),
        ...mapState('elementosPublicos',['plugins']),
        ...mapState('elementosPublicos',['informacionUsuario']),
        ...mapState('elementosPublicos',['sesionIniciada'])
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