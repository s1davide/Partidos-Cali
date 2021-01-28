<template>
<div>
    <q-dialog v-model="propsSeleccionaImagen.dialogoPrimerInicio" 
       :maximized="true">
                   <q-card>
                        <q-toolbar>
                        <q-avatar  >
                            <q-icon  name="account_circle" />
                        </q-avatar>

                        <q-toolbar-title><span class="text-weight-bold">Primer Inicio</span> </q-toolbar-title>
                        <q-btn flat round dense @click="" icon="close" v-close-popup />
                        </q-toolbar>

                        <q-card-section>
                            <div class="text-h6 text-center">Foto de Perfil</div>        
                            <div class="row justify-center q-mb-md">
                                <q-img
                                    :src="imagenSeleccionadaFinal"
                                    spinner-color="white"
                                    style="height: 300px; max-width: 300px"
                                    img-class="my-custom-image"
                                    class="rounded-borders"
                                    id="imageCrop"
                                    >
                                </q-img>           
                            </div>
                            <div class="column flex-center">
                                <q-btn-toggle
                                    v-model="origenImagen"
                                    class="q-mb-sm"
                                    no-caps
                                    rounded        
                                    toggle-color="positive"
                                    color="white"
                                    text-color="positive"
                                    @click="urlImagen=''; imageFile=null; restauraImagen()"
                                    :options="[
                                        {label: 'Imagen Local', value: 'local'},
                                        {label: 'Imagen URL', value: 'url'}
                                    ]"
                                    />
                                    <q-file v-if="origenImagen=='local'" ref="inputFile" @input="comprobarImagen($refs.inputFile)" dense style="max-width: 630px;" 
                                    class="q-mb-sm" filled bottom-slots v-model="imageFile" label="Archivo de Imagen"  counter
                                    :rules="[val => imagenValida==true || 'Archivo de Imagen no válido']"
                                    >
                                        <template v-slot:prepend>
                                        <q-icon name="cloud_upload" @click.stop />
                                        </template>
                                        <template v-slot:append>
                                        <q-icon name="close" @click.stop.prevent="imageFile = null; imagenValida= true; $refs.inputFile.resetValidation();" class="cursor-pointer" />
                                        </template>
                                        <template v-slot:hint>
                                        Suelte o haga clic para seleccionar un archivo de Imagen
                                        </template>
                                    </q-file>
                                    <q-input v-else-if="origenImagen!='local'"
                                            filled                                            
                                            v-model="urlImagen"
                                            label="URL Imagen *"   
                                            style="max-width: 630px; width: 100%"   
                                            class="q-mb-sm"                              
                                            hint="Ingrese o pegue la ruta de la imagen"    
                                            ref="inputURL"                                        
                                            @keyup="comprobarImagen($refs.inputURL)"
                                            @input="comprobarImagen($refs.inputURL)"
                                            :dense="true"
                                            lazy-rules
                                            autofocus
                                            :rules="[val => imagenValida==true  || 'URL de Imagen no válido']" >
                                        <template v-slot:append>
                                            <q-icon name="close" @click="urlImagen='';enfocar($refs.inputURL)" class="cursor-pointer" />
                                        </template>
                                    </q-input>
                                    <q-form
                                    class="q-gutter-md"
                                    @submit="actualizarPerfil"
                                    style="max-width: 646px; width: 100%;"
                                    >     
                                      <q-input
                                        filled
                                        v-model="nombreUsuario"
                                        label="Nombre de Usuario"
                                        hint="Nombre de usuario de la cuenta"
                                        :dense="true"
                                        lazy-rules
                                        :rules="[ val => val && val.length > 0 || 'Debe Ingresar un nombre de Usuario',
                                            val => val.length <= 20 || 'El nombre de usuario debe tener un máximo de 20 caracteres.',
                                        ]"
                                    />    
                                    <div class="row justify-end">
                                    <q-btn flat label="Aceptar" type="submit" color="positive"  />
                                    <q-btn flat label="Cancelar" @click="cancelar" v-close-popup color="negative"  />
                                    
                                    </div>
                                    </q-form>  
                                    
                            </div>
                        </q-card-section>
                        <q-card-actions align="right" class="text-primary">                            
                        </q-card-actions>

                    </q-card>                
            </q-dialog>
            <CortarImagen :funcionesCortar="funcionesCortar" :propsSeleccionaImagen="propsSeleccionaImagen"/>
</div>
</template>
<script>
import * as firebase from 'boot/firebase.js'
import * as validaImagen from 'boot/validaImagen.js'
import CortarImagen from 'components/login/CortarImagen.vue'
import {mapState} from 'vuex'
export default {
    components:{ CortarImagen},
    props:{
        propsSeleccionaImagen:{}
    },
    mounted(){                 
        this.$nextTick(()=>{
            this.funcionesCortar= {
            seleccionadaImagenCortada: this.seleccionadaImagenCortada,         
            noSeleccionadaImagenCortada: this.noSeleccionadaImagenCortada
            }
        })   

        this.imagenSeleccionadaFinal = this.imagenBase;
        
    },
    data(){
        return{
            nombreUsuario:'',
            ////////////Procesamiento Imagen/////////////////////////
            origenImagen: 'local',
            urlImagen:'',
            imageFile: null,
            imagenSubida: false,            
            imagenValida: true,
            ////////////Procesamiento Imagen/////////////////////////
            ////////////Preparacion Imagen Final/////////////////////////
            imagenSeleccionadaFinal:'',
            ////////////Preparacion Imagen Final/////////////////////////
            ////////////Para enviar la instancia de funciones en props/////////////////////////
            funcionesCortar: {}
            ////////////Para enviar la instancia de funciones en props/////////////////////////
        }
    },
    methods:{
        actualizarPerfil(){
            //inputFile
            if(this.imageFile==null && this.urlImagen=='' && this.imagenValida){
                console.log()                       
                firebase.auth.currentUser.updateProfile({
                    displayName: this.nombreUsuario,
                    photoURL: 'na'
                }).then(()=>{this.$router.push('/')})                 
            }else if(!this.imagenValida){
                this.comprobarImagen(this.$refs.inputFile)                
            }
            else{
                let cargandoInfo =   this.$q.dialog({
                            message: 'Actualizando Información de Perfil',
                            progress: true, // we enable default settings
                            persistent: true, // we want the user to not be able to close it
                            ok: false // we want the user to not be able to close it
                        })
                let nameFile = firebase.auth.currentUser.email;         
                firebase.storageRef.child(`avatar/${nameFile}`).putString(this.imagenSeleccionadaFinal, 'data_url').then((image)=>{
                   firebase.storageRef.child(`avatar/${nameFile}`).getDownloadURL().then((url)=>{
                        firebase.auth.currentUser.updateProfile({
                            displayName: this.nombreUsuario,
                            photoURL: url
                        }).then(()=>{cargandoInfo.hide(); this.$router.go(); this.$router.push('/');}) 
                    })
                })                
            }
        },            
        async comprobarImagen(instanciaInput){            
            let url;
            this.imagenValida= true
            instanciaInput.resetValidation()
            if(this.origenImagen=='local'){
                url =URL.createObjectURL(this.imageFile);
            }
            else{
                url = this.urlImagen
            }        
            
            if(await validaImagen.validaURL(url)){            
                this.recortarImagen()
            }
            else if(this.imageFile!=null || this.urlImagen!='' ){     
                    this.restauraImagen();               
                    this.imagenValida= false                    
                    instanciaInput.validate();
            }  
        },
        async recortarImagen(){                          
            let imagenRecortar;             
            let dialogCargandoUrl;
                                                    
                    if(this.origenImagen=='local'){
                        imagenRecortar = await this.$fileB64(this.imageFile)                       
                    }else{
                        dialogCargandoUrl =   this.$q.dialog({
                            message: 'Cargando Imagen desde URL',
                            progress: true, // we enable default settings
                            persistent: true, // we want the user to not be able to close it
                            ok: false // we want the user to not be able to close it
                        })
                        await this.$axios(this.urlImagen, {responseType: 'arraybuffer'}).then((image)=>{
                                    imagenRecortar = this.$arrayB64(image)                                
                        }).catch(async (error)=>{       
                            let res = await this.obtenerImagenSinCabeceraCORS()
                            imagenRecortar = res.data.respuesta;                                                                                                
                        })
                            dialogCargandoUrl.hide();
                    }    
                        
                        this.propsSeleccionaImagen.urlImagen =imagenRecortar;
                        this.propsSeleccionaImagen.dialogoCortar = true;                                                 
        },
        obtenerImagenSinCabeceraCORS(){
                let imageB64  =   this.$axios(`https://apiobtenerimagenes.herokuapp.com/getImage?url=${this.urlImagen}`);                
                 return imageB64   ;
        },
        enfocar(target){            
            target.focus();
        },        
        seleccionadaImagenCortada(urlImagenCortada){
            this.imagenSeleccionadaFinal = urlImagenCortada;            
        },
        noSeleccionadaImagenCortada(){            
            this.imageFile = null
            this.urlImagen = ''
        },
        restauraImagen(){
            this.imagenSeleccionadaFinal = this.imagenBase;
        },
        cancelar(){
            firebase.auth.signOut().then(() => {                  
            })
        },        



    },
    computed:{
        ...mapState('elementosPublicos',['imagenBase'])
        
    }
}
</script>