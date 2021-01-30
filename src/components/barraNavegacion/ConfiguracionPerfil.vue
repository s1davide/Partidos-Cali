<template>
  <div>
        <q-dialog
        v-model="menuConfiguracionPerfil"
        persistent
        :maximized="true"
        transition-show="slide-up"
        transition-hide="slide-down"
        
      >
      <q-card class="bg-white text-black">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6 text-center">Foto de Perfil</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <div class="row justify-center q-mb-md">
                <q-img
                    :src="imagenSeleccionadaFinal"
                    spinner-color="white"
                    style="height: 300px; max-width: 300px"
                    img-class="my-custom-image"
                    class="rounded-borders"
                    >     
                    <q-btn :disable="permiteQuitarImagen" class="absolute-bottom-right " style="height:24px; width: 24px;border-radius: 0;top: 8px; left: 8px"
                    @click="restaurarImagenBase=true; imagenSeleccionadaFinal=imagenBase; permiteQuitarImagen=true;">
                    <q-icon flat style="top: -4px; left: -3px" class="absolute all-pointer-events" size="32px" name="disabled_by_default" color="red-7" >
                      <q-tooltip clickable>
                        Quitar Imagen
                      </q-tooltip>
                    </q-icon>  
                    </q-btn>             
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
              <q-file v-if="origenImagen=='local'" ref="inputFile" dense @input="comprobarImagen($refs.inputFile)" style="max-width: 630px;"
               class="q-mb-sm" filled bottom-slots v-model="imageFile" label="Archivo de Imagen" counter
               :rules="[val => imagenValida==true || 'Archivo de Imagen no válido']"
               >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop />
                    </template>
                    <template v-slot:append>
                      <q-icon name="close" @click.stop.prevent="imageFile = null; imagenValida= true; $refs.inputFile.resetValidation();                       
                      restauraImagen();" class="cursor-pointer" />
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
                    bottom-slots                    
                    :dense="true"
                    ref="inputURL"     
                    @keyup="comprobarImagen($refs.inputURL)"
                    @input="comprobarImagen($refs.inputURL)"
                    lazy-rules                    
                    autofocus
                    :rules="[val => imagenValida==true  || 'URL de Imagen no válido']"> 
                    <template v-slot:append>
                      <q-icon name="close" @click="urlImagen=''; enfocar($refs.inputURL); restauraImagen();                      
                      " class="cursor-pointer" />
                    </template>
                  </q-input>
             <q-form
                class="q-gutter-md"
                @submit="imagenValida?dialogoConfirmarContrasena=true:null"
                style="max-width: 646px; width: 100%;"
                >                        
                <q-input
                    filled
                    v-model="email"
                    label="Correo Electronico *"                                    
                    hint="Ingrese su Correo Electrónico"
                    :dense="true"
                    lazy-rules
                    autofocus
                    :rules="[ 
                    val => val && val.length > 0 || 'El campo no puede quedar vacío',
                    
                    ]"
                />
                <q-input
                    filled
                    v-model="user"
                    label="Nombre de Usuario"
                    hint="Nombre de usuario de la cuenta"
                    :dense="true"
                    lazy-rules
                    :rules="[ 
                        val => val && val.length > 0 || 'El campo no puede quedar vacío',
                        val => val.length <= 20 || 'El nombre de usuario debe tener un máximo de 20 caracteres.',
                    ]"
                />        
                <div  class="row">                
                  <q-chip clickable square color="teal" @click="dialogoCambiarContrasena=true"  text-color="white" icon="security" label="Cambiar Contraseña" />
                </div>
                <div class="row justify-end">
                    <q-btn label="Aceptar" type="submit" color="positive"/>
                    <q-btn  @click="menuConfiguracionPerfil=false" label="Cancelar" color="positive" flat class="q-ml-sm" />
                </div>
            </q-form>
            </div>
        </q-card-section>
      </q-card>
    </q-dialog>    
       <q-dialog v-model="dialogoVerificacion" >
                   <q-card>
                        <q-toolbar>
                        <q-avatar  >
                            <q-icon  name="lock" />
                        </q-avatar>

                        <q-toolbar-title><span class="text-weight-bold">Partidos Cali</span> </q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup />
                        </q-toolbar>

                        <q-card-section>
                            Debe verificar su correo haciendo click en el link que fue enviado a su correo electrónico, y luego hacer clic en aceptar.
                        </q-card-section>
                        <q-card-actions align="right" class="text-primary">
                            <q-btn flat label="Aceptar" @click="revisaVerificacionCorreo(true)" color="positive"  v-close-popup />                            
                            <q-btn flat label="Cancelar" @click="revisaVerificacionCorreo(false)" color="positive"  v-close-popup /> 
                        </q-card-actions>

                    </q-card>                
            </q-dialog>
    <!----------------- Dialogo Confirmar contraseña 1 ---------------------------------->
     <q-dialog v-model="dialogoConfirmarContrasena" @before-hide="contrasenaConfirmacion=''">
                   <q-card>
                        <q-toolbar>
                        <q-avatar  >
                            <q-icon  name="lock" />
                        </q-avatar>

                        <q-toolbar-title><span class="text-weight-bold">Acción Seguridad</span> </q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup />
                        </q-toolbar>
                        <q-card-section class="q-pb-none">
                                    <q-form
                                class="q-gutter-md"
                                @submit="actualizarInfo"
                                >
                                <q-input
                                    filled
                                    v-model="contrasenaConfirmacion"
                                    ref="inputConfirmPass1"
                                    label="Contraseña"
                                    hint="Ingrese su Contraseña"   
                                    type="password" 
                                    :dense="true"        
                                    @keydown="contrasenaValida=true"
                                    lazy-rules
                                    autofocus
                                    :rules="[ 
                                    val => val && val.length > 0 || 'Debe ingresar la contraseña',
                                    val=> contrasenaValida==true || mensajeError
                                    ]"
                                />
                                <q-card-actions align="right" class="text-primary">
                                    <q-btn flat label="Aceptar" type="submit" color="positive"   />
                                    <q-btn flat label="Cancelar"  color="positive"  v-close-popup/>
                                </q-card-actions>
                                </q-form>
                        </q-card-section>
                    </q-card>
            </q-dialog>  
    <!----------------- Dialogo Cconfirmar contraseña 1 ---------------------------------->     
    <!----------------- Dialogo Confirmar contraseña 1 ---------------------------------->
     <q-dialog v-model="dialogoCambiarContrasena" @before-hide="contrasenaConfirmacion=''; nuevaContrasena=''">
                   <q-card>
                        <q-toolbar>
                        <q-avatar  >
                            <q-icon  name="lock" />
                        </q-avatar>

                        <q-toolbar-title><span class="text-weight-bold">Acción Seguridad</span> </q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup />
                        </q-toolbar>
                        <q-card-section class="q-pb-none">
                                    <q-form
                                class="q-gutter-md"
                                @submit="cambiarContrasena"
                                >
                                <q-input
                                    filled
                                    v-model="contrasenaConfirmacion"
                                    ref="inputConfirmPass2"
                                    label="Contraseña"
                                    hint="Ingrese su Contraseña Actual"   
                                    type="password" 
                                    :dense="true"        
                                    @keydown="contrasenaValida=true"
                                    lazy-rules
                                    autofocus
                                    :rules="[ 
                                    val => val && val.length > 0 || 'Debe ingresar la contraseña',
                                    val=> contrasenaValida==true || mensajeError
                                    ]"
                                />
                                <q-input
                                    filled
                                    v-model="nuevaContrasena"
                                    ref="inputNewPass"
                                    label="Contraseña"
                                    hint="Ingrese su Contraseña Actual"   
                                    type="password" 
                                    :dense="true"        
                                    @keydown=""
                                    lazy-rules
                                    :rules="[ 
                                    val => val && val.length > 0 || 'Debe ingresar  nueva la contraseña',
                                    val =>val.length >= 6 || 'La contraseña debe tener como mínimo 6 caracteres.'     
                                    ]"
                                />
                                <q-card-actions align="right" class="text-primary">
                                    <q-btn flat label="Aceptar" type="submit" color="positive"   />
                                    <q-btn flat label="Cancelar"  color="positive"  v-close-popup/>
                                </q-card-actions>
                                </q-form>
                        </q-card-section>
                    </q-card>
            </q-dialog>  
    <!----------------- Dialogo Cconfirmar contraseña 1 ---------------------------------->     
    <CortarImagen :funcionesCortar="funcionesCortar" :propsSeleccionaImagen="propsSeleccionaImagen"/>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import * as validaImagen from 'boot/validaImagen.js';
import CortarImagen from 'components/login/CortarImagen.vue'
export default {
    components:{ CortarImagen},
    props:{
    },
    data(){
      return{
        origenImagen:'local',
        imageFile: null,
        imagenValida: true,
        urlImagen:'',
        email:'',
        user:'',
        ////////////////////                
        ///////////////////
        permiteQuitarImagen: true,
        restaurarImagenBase: false,
        ////////////Para enviar la instancia de funciones en props/////////////////////////
        funcionesCortar: {},
        propsSeleccionaImagen:{},
        ////////////Para enviar la instancia de funciones en props/////////////////////////
        imagenSeleccionadaFinal:'',
        //////////////7
        dialogoVerificacion: false,
        dialogoConfirmarContrasena:false,
        dialogoCambiarContrasena:false,
        contrasenaConfirmacion:'',
        nuevaContrasena: '',
        contrasenaValida:true,
        mensajeError:'', 
        mensajeDialogoCargando: '',
        emailAnterior: '',
        esImagenBase: false
      }
    },
    methods:{
      async actualizarInfo(){
          var user = this.$firebase.auth().currentUser;          
          let photoURL = 'na'                                  
          this.dialogoConfirmarContrasena = false;                       
          this.plugins.dialogoCargando("show","Actualizando Información de Perfil",true,false);           
          await new Promise ((resolve, reject)=>{ 
              this.$firebase.auth().signInWithEmailAndPassword(user.email, this.contrasenaConfirmacion)
              .then(async (res)=>{               
                resolve()
              }).catch((error)=>{
              switch (error.code) {
                case 'auth/wrong-password':
                  this.plugins.dialogoCargando("","",'','');  
                  this.plugins.dialogoCargando("show","Contraseña Incorrecta",false,true);  
                break;
                case 'auth/too-many-requests':
                    this.plugins.dialogoCargando("","",'','');  
                    this.plugins.dialogoCargando("show",`Se ha ingresado la contraseña de forma incorrecta varias veces, 
                    por lo cual el acceso a esta cuenta ha sido temporalmente bloqueado, puede solicitar un reseteo de la contraseña`
                    ,false,true);
                    this.dialogoCambiarContrasena=false;
                break;
                }
              })
          })                                                                    
          this.contrasenaConfirmacion= ''  ;
          let resCambioCorreo = await this.actualizarCorreo(user, user.email)             
          if(resCambioCorreo.resultado==false){  
            if(resCambioCorreo.error=='auth/invalid-email'){              
              this.plugins.dialogoCargando("","",'','');  
              this.plugins.dialogoCargando("show","Estructura de correo inválida",false,true);    
            }else{
               this.plugins.dialogoCargando("","",'','');  
              this.plugins.dialogoCargando("show","La dirección de correo ya está en uso",false,true);    
            }
            throw new Error("Correo incorrecto");        
          };          
          this.esImagenBase&&this.urlImagen==''&&this.imageFile==null?this.restaurarImagenBase=true:this.restaurarImagenBase=false         
          this.emailAnterior= user.email;                        
          if(!this.restaurarImagenBase && resCambioCorreo.resultado ){             
             if(this.urlImagen==''&&this.imageFile==null){               
               this.imagenSeleccionadaFinal =await this.$firebaseGetImg(this.imagenSeleccionadaFinal)     //Firebase en base64          
             }
             photoURL =await this.cambiaNombreImagen() 
             user.email!=this.email?this.dialogoVerificacion = true:this.dialogoVerificacion = false            
          }                             
          await new Promise ((resolve, reject)=>{ 
            user.updateProfile({
                    displayName: this.user,
                    photoURL: photoURL
            }).then(()=>{                                             
              resolve();
            }) 
          })  
          this.plugins.dialogoCargando("","",'','')
          
            
          this.$router.go()
          this.menuConfiguracionPerfil = true
         
      },

      actualizarCorreo(user, email){
        if(email!=this.email){      
          this.plugins.dialogoCargando("","",'','')
          this.plugins.dialogoCargando("show","Actualizando correo electronico",true,false)                        
          return  new Promise ((resolve, reject)=>{       
            user.updateEmail(this.email).then(function(res) {        
              user.sendEmailVerification().then(function() {                        
                  resolve({resultado:true})
              }).catch(function(error) {resolve({resultado:false, error: error})});
            }).catch(function(error) {resolve({resultado:false, error: error.code}); console.log(error);});    
          })
        }else{
          return {resultado:true}
        }
      },

      async cambiaNombreImagen(){
        return new Promise (async (resolve, reject)=>{ 
          let nuevaUrlImagen= '';                              
          nuevaUrlImagen= await this.subirImagenBase64(this.imagenSeleccionadaFinal);          
          if(this.emailAnterior!=this.email){
            await new Promise ((resolve, reject)=>{  
              this.$firebase.storage().ref().child(`avatar/${this.emailAnterior}`).delete().then(()=>{resolve()})
            }).catch((error)=>{})
          }          
          resolve(nuevaUrlImagen);
        })
      },
      subirImagenBase64(urlBase64){
        return new Promise ((resolve, reject)=>{  
          this.$firebase.storage().ref().child(`avatar/${this.email}`).putString(urlBase64, 'data_url').then((image)=>{
                this.$firebase.storage().ref().child(`avatar/${this.email}`).getDownloadURL().then((url)=>{                          
                  resolve(url)
                })   
            })
        })
      },
      revisaVerificacionCorreo(accion){
        var user = this.$firebase.auth().currentUser;
          if(accion){                          
             if(user.emailVerified){
               dialogoConfirmarContrasena=false;               
               this.plugins.notificacion("Correo actualizado correctamente", "positive", "", 4000);     
             }else{
               this.dialogoVerificacion =false
               this.dialogoVerificacion =true
             }      

          }else{              
              user.updateEmail(this.emailAnterior).then(function(res) {        
                  user.sendEmailVerification().then(function() {                        
                      this.dialogoVerificacion = false
                      firebase.auth.signOut().then(() => {
                        this.plugins.notificacion("Correo no actualizado correctamente, debe verificar e ingresar con su correo anterior"
                        , "negative", "", 4000);     
                        this.$router.go();
                        this.$router.push('/login')
                      }).catch((error) => {});                       
                  }).catch(function(error) {});
              }).catch(function(error) {});    
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
      cambiarContrasena(){
        var user = this.$firebase.auth().currentUser;  
        let self= this;
        this.plugins.dialogoCargando("show","Cambiando Contraseña",true,false)                        
        this.$firebase.auth().signInWithEmailAndPassword(user.email, this.contrasenaConfirmacion)
        .then(()=>{
          user.updatePassword(this.nuevaContrasena).then(function() {
              self.plugins.dialogoCargando("","",'','')               
              self.dialogoCambiarContrasena=false;         
              self.plugins.notificacion("La contraseña ha sido cambiada", "positive", "", 4000);   
          }).catch(function(error) {             
              console.log(error)
          });
        }).catch((error)=>{
          //auth/wrong-password
          switch (error.code) {
          case 'auth/wrong-password':
            this.plugins.dialogoCargando("","",'','') 
            this.mensajeError= 'Contraseña Incorrecta';          
            this.contrasenaValida=false;
            this.$refs.inputConfirmPass2.validate()
            this.$refs.inputNewPass.validate()            
            break;
            case 'auth/too-many-requests':
              this.plugins.dialogoCargando("show",`Se ha ingresado la contraseña de forma incorrecta varias veces, 
              por lo cual el acceso a esta cuenta ha sido temporalmente bloqueado, puede solicitar un reseteo de la contraseña`
              ,false,true);
              this.dialogoCambiarContrasena=false;
            break;

          }          
          
            
        })
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
                            let res = await this.obtenerImagenSinCabeceraCORS(this.urlImagen)
                            imagenRecortar = res.data.respuesta;                                                                                                
                        })
                            dialogCargandoUrl.hide();
                    }    
                        
                        this.propsSeleccionaImagen.urlImagen =imagenRecortar;
                        this.propsSeleccionaImagen.dialogoCortar = true;                                                 
        },
      obtenerImagenSinCabeceraCORS(urlImagen){
                let imageB64  =   this.$axios(`https://apiobtenerimagenes.herokuapp.com/getImage?url=${urlImagen}`);                
                 return imageB64   ;
      },
      restauraImagen(){
        if(this.restaurarImagenBase){
          this.imagenSeleccionadaFinal = this.imagenBase
        }else{
          this.imagenSeleccionadaFinal = this.informacionUsuario.urlImg
        }
          
      },
      seleccionadaImagenCortada(urlImagenCortada){
          this.imagenSeleccionadaFinal = urlImagenCortada;            
      },
      noSeleccionadaImagenCortada(){            
          this.imageFile = null
          this.urlImagen = ''
      },
      enfocar(target){            
          target.focus();
      },        
    },
    mounted(){      
      
      this.$nextTick(()=>{
        this.funcionesCortar= {
          seleccionadaImagenCortada: this.seleccionadaImagenCortada,         
          noSeleccionadaImagenCortada: this.noSeleccionadaImagenCortada
        }
      })
      this.propsSeleccionaImagen ={
        urlImagen: '',
        dialogoCortar: false
      }
      
    },
    updated(){
      if(!this.menuConfiguracionPerfil){
        this.email = this.informacionUsuario.email
        this.user =this.informacionUsuario.nombreUsuario
        this.imagenSeleccionadaFinal = this.informacionUsuario.urlImg
        var user = this.$firebase.auth().currentUser
        if(user!=null){
          if(user.photoURL=='na'){
            this.permiteQuitarImagen=true;
            this.restaurarImagenBase=true;
            this.esImagenBase=true
          }else{
            this.permiteQuitarImagen=false;
          }
        }
        
        
      }
      
    },
    computed:{        
        ...mapState('elementosPublicos',['informacionUsuario']),
        ...mapState('elementosPublicos',['imagenBase']),
        ...mapState('elementosPublicos',['plugins']),
        menuConfiguracionPerfil:{
            get(){
                return this.$store.state.elementosPublicos.menuConfiguracionPerfil
            },
            set(value){
                this.$store.commit('elementosPublicos/setMenuConfiguracionPerfil', value)
            }
        }
    }
}
</script>