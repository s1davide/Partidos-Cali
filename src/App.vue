<template>
  <div id="q-app">         
    <router-view v-if="informacionCargada" />    
  </div>
</template>
<script>
import { Notify } from 'quasar';
import * as firebase from 'boot/firebase' 
import * as validaImagen from 'boot/validaImagen'
import {mapState, mapMutations, mapActions} from 'vuex'
export default {
  name: 'App',
  data(){
    return{      
      accionLogin: 'login',
      informacionCargada: false,     
      dialogLoadingInstancia: '' 
    }
  },  
  
  mounted(){
    this.loading("show")
    this.plugins={      
      notificacion: this.notify,
      cargando: this.loading     ,
      dialogoCargando: this.dialogLoading 
    }     
    this.setLogo(require('assets/img/balon2.png'))
    this.informacionCargada=false;
    this.verificaLogin()    
  }, 
  methods:{        
     verificaLogin(){
      this.imagenBase = require('assets/img/avatar.png');    
      firebase.auth.onAuthStateChanged(async (user)=>{        
        if(user && user.emailVerified){        
          let ingresadoDatosInicio = user.displayName !=null && user.photoURL!=null;          
            if(!ingresadoDatosInicio && this.$route.path=='/')
            { 
              firebase.auth.signOut().then(() => {}) 
              this.notify('Debe establecer un nombre de usuario como mínimo para iniciar sesión', 'negative','',3000)  
               }
                          
            if(user.photoURL=='na' && ingresadoDatosInicio){        
              this.sesionIniciada =true                      
              this.setInformacionUsuario({
                nombreUsuario: user.displayName,
                email: user.email,
                urlImg: this.imagenBase
              });
            }else if(user.photoURL!='na' && ingresadoDatosInicio){         
              this.sesionIniciada =true           
              let urlImagen;    
              await validaImagen.validaURL(user.photoURL)? urlImagen=user.photoURL:urlImagen= await this.descargaImagenFirebase(user.email);
              await this.actualizaURLFotoUsuario(urlImagen);
              this.setInformacionUsuario({
                    nombreUsuario: user.displayName,
                    email: user.email,
                    urlImg: urlImagen
                });                                     
              };                
        }else{
            this.sesionIniciada = false            
            this.setInformacionUsuario({
              nombreUsuario: 'Iniciar Sesion',
              email: 'na',
              urlImg: this.imagenBase
        });        
        }
        this.informacionCargada=true;
        this.loading();
      })
    },        

    setAccionLogin(accion){      
      this.accionLogin = accion
      this.$router.push('login');
    },        
    notify(mensaje, color, icon, duracion){
      this.$q.notify({
          message: mensaje,
          color: color,
          icon: icon,
          position: 'top',
          timeout: duracion
      })
    },   
    loading(accion){
      if(accion=="show"){
        this.$q.loading.show({
        delay: 400, // ms
        /* spinner: QSpinnerGears, */
        spinnerColor: 'white',
        messageColor: 'white',
        backgroundColor: 'green',
        message: 'Cargando ...'
      }) 
      }else{
        this.$q.loading.hide();
      }
    },  
    dialogLoading(accion, mensaje, progreso, botonOk ){
      if(accion=='show'){
        this.dialogLoadingInstancia = this.$q.dialog({
          message: mensaje,
          progress: progreso, // we enable default settings
          persistent: true, // we want the user to not be able to close it
          ok: botonOk // we want the user to not be able to close it
        })
      }else{
        this.dialogLoadingInstancia.hide();
      }
    } ,
    async descargaImagenFirebase(fileName){
      return new Promise ((resolve,reject)=>{
        firebase.storageRef.child(`avatar/${fileName}`).getDownloadURL().then((url)=>{
                      resolve(url);
        })
      })
    },
    async actualizaURLFotoUsuario(urlImagen){
      firebase.auth.currentUser.updateProfile({                    
          photoURL: urlImagen
      }) 
    },
    ...mapMutations('elementosPublicos',['setInformacionUsuario']),
    ...mapMutations('elementosPublicos',['setLogo']),
  },

  computed: {
    sesionIniciada:{
      get(){
        return this.$store.state.elementosPublicos.sesionIniciada
      },
      set(value){
        this.$store.commit('elementosPublicos/setSesionIniciada',value)
      },
    },
    plugins:{
      get(){
        return this.$store.state.elementosPublicos.plugins
      },
      set(value){
        this.$store.commit('elementosPublicos/asignaInstanciaPlugins',value)
      }
    },
    imagenBase:{
      get(){
        return this.$store.state.elementosPublicos.imagenBase
      },
      set(value){
        this.$store.commit('elementosPublicos/setImagenBase',value)
      }
    }
    
     
  }
};
</script>
