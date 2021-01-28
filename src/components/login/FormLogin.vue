<template >
    <div >
        <q-form
            class="q-gutter-md"
            @submit="loguear"
            >
            <q-input
                filled
                v-model="email"
                ref="inputEmail"
                label="Correo Electronico"
                hint="Ingrese su Correo"    
                :dense="true"        
                @keydown="correoValido=true, contrasenaValida=true"
                lazy-rules
                autofocus
                :rules="[ 
                val => val && val.length > 0 || 'El campo no puede quedar vacío',
                val=> correoValido==true || mensajeError
                ]"
            />
            <q-input
                filled
                type="password"
                v-model="password"
                ref="inputContrasena"
                label="Contraseña"            
                hint="Ingrese su contraseña"     
                :dense="true" 
                @keydown="contrasenaValida=true, correoValido=true"
                lazy-rules
                :rules="[
                    val => val && val.length > 0 || 'El campo no puede quedar vacío',
                    val => val.length >= 6 || 'La contraseña debe tener como mínimo 6 caracteres.',
                    val => contrasenaValida==true || mensajeError
                ]"
            />
            <div  class="row">                
                <q-chip clickable square color="teal" @click="abrirDialogoRecuperacion($event)" text-color="white" icon="security" label="Recuperar Contraseña" />
            </div>
            <div class="row justify-end">
                <q-btn label="Ingresar" type="submit" color="positive"/>
                <q-btn @click="$router.push('/')" label="Cancelar" color="positive" flat class="q-ml-sm" />
            </div>
            </q-form>
            <!----------------- Dialogo Recuperación Contraseña ---------------------------------->
            <q-dialog v-model="dialogoRecuperacion" persistent>
                <q-card style="min-width: 350px">
                    <q-card-section>
                    <div class="text-h6">Recuperar Contraseña</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                        <q-input label="Correo Electronico" hint="Ingrese su Correo" :dense="true"  
                        v-model="emailRecover" autofocus @keyup.enter="prompt = false" 
                        ref="inputRecuperarPass"
                        @keydown="correoValido=true"
                        :rules="[
                        val=> val!='' || 'El campo no puede quedar vacio',
                        val=> correoValido==true || 'El correo no ha sido registrado'
                        ]"
                        />
                    </q-card-section>
                    <q-card-actions align="right" class="text-primary">
                        <q-btn flat label="Cancelar" @click="emailRecover=''" v-close-popup />
                        <q-btn label="Enviar Correo de Recuperacion" color="positive" @click="recuperarContrasena" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
            <!----------------- Dialogo Recuperación Contraseña ---------------------------------->
            <!----------------- Dialogo No ha verificado la cuenta ---------------------------------->
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
                            Debe verificar su cuenta haciendo click en el link que fue enviado a su correo electrónico.
                        </q-card-section>
                        <q-card-actions align="right" class="text-primary">
                            <q-btn flat label="Aceptar" color="positive"  v-close-popup />
                            <q-btn flat label="Cambiar Correo" @click="dialogoCambioCorreo=true" color="positive"  v-close-popup />
                        </q-card-actions>
                    </q-card>
            </q-dialog>
            <!----------------- Dialogo No ha verificado la cuenta ---------------------------------->
            <!----------------- Dialogo Cambiar cuenta de correo No valida ---------------------------------->
            <q-dialog v-model="dialogoCambioCorreo" >
                   <q-card>
                        <q-toolbar>
                        <q-avatar  >
                            <q-icon  name="lock" />
                        </q-avatar>

                        <q-toolbar-title><span class="text-weight-bold">Partidos Cali</span> </q-toolbar-title>
                        <q-btn flat round dense icon="close" v-close-popup />
                        </q-toolbar>
                        <q-card-section class="q-pb-none">
                                    <q-form
                                class="q-gutter-md"
                                @submit="cambiarCorreo"
                                >
                                <q-input
                                    filled
                                    v-model="cambioEmail"
                                    ref="inputChangeEmail"
                                    label="Nuevo Correo"
                                    hint="Ingrese su nuevo Correo"    
                                    :dense="true"        
                                    @keydown="correoValido=true, contrasenaValida=true"
                                    lazy-rules
                                    autofocus
                                    :rules="[ 
                                    val => val && val.length > 0 || 'El campo no puede quedar vacío',
                                    val=> correoValido==true || mensajeError
                                    ]"
                                />
                                <q-card-actions align="right" class="text-primary">
                                    <q-btn flat label="Aceptar" type="submit" color="positive"   />
                                    <q-btn flat label="Cancelar" color="positive"  v-close-popup />
                                </q-card-actions>
                                </q-form>
                            
                        </q-card-section>
                        
                        
                    </q-card>
            </q-dialog>
            
            <!----------------- Dialogo Cambiar cuenta de correo No valida ---------------------------------->
            <PrimerInicio :propsSeleccionaImagen="propsSeleccionaImagen"/>
            
        </div>
</template>
<script>
import * as firebase from 'boot/firebase' 
import {mapState} from 'vuex'
import PrimerInicio from 'components/login/PrimerInicio.vue'
export default {    
    components:{PrimerInicio},
    data(){
        return{
            email:'',
            password:'',
            dialogoRecuperacion: false,
            dialogoVerificacion: false,
            dialogoCambioCorreo: false,
            emailRecover:'',       
            correoValido: true,
            mensajeError: '',
            contrasenaValida: true,
            /////Activar Formulario Primer Inicio            
            propsSeleccionaImagen: {}, 
            cambioEmail:'',
            correoAnterior: ''
        }
    },
    mounted(){
        
    },
    created(){
        

    },
    methods:{
        loguear(){
            firebase.auth.signInWithEmailAndPassword(this.email, this.password)
            .then(()=>{                
                this.estadoConfirmacion();
            })
            .catch((error)=>{
                let noExiste = "El correo ingresado no está registrado en el Sistema";
                let invalido = "Ha ingresado una dirección de correo con formato no válido";
                let contrasenaInvalida = "La contraseña que ha ingresado es incorrecta.";
                
                this.mensajeError=invalido;
                if(error.code=="auth/user-not-found"){
                    this.mensajeError=noExiste;
                    this.correoValido=false;
                }else if(error.code=="auth/wrong-password"){
                    this.mensajeError=contrasenaInvalida;
                    this.contrasenaValida=false;
                }else if(error.code=="auth/too-many-requests"){
                    let mensaje = `La cuenta ha sido temporalmente bloqueada por recibir muchas solicitudes de ingreso fallidas,
                    puede solicitar la recuperación de la contraseña.`
                    this.plugins.notificacion(mensaje, "negative", "", 2000) 
                }
                else{
                    this.mensajeError=invalido;
                    this.correoValido=false;
                }
                this.$refs.inputContrasena.validate();
                this.$refs.inputEmail.validate();                
            })
        },
        estadoConfirmacion(){            
            var user = firebase.auth.currentUser;     
            console.log(user)       
            if(!user.emailVerified){
                this.dialogoVerificacion =true
                firebase.auth.signOut().then(() => {}).catch((error) => {}); 
            }else if(user.displayName ==null|| user.photoURL==null){
                this.primerInicio();
            }
            else{
                this.$router.push('/');
                this.$router.go();                
                this.plugins.notificacion("Sesión Iniciada", "positive", "", 1000);                
            }          
        },
        abrirDialogoRecuperacion(ev){
            ev.preventDefault()
            this.dialogoRecuperacion=true
        },
        recuperarContrasena(ev){            
            firebase.auth.sendPasswordResetEmail(this.emailRecover)
            .then(()=>{
                 this.plugins.notificacion("Correo de recuperacion enviado", "positive", "", 1000)
                 this.dialogoRecuperacion = false;
            }).catch((error)=>{
                console.log(error)
                this.correoValido = false                
                this.$refs.inputRecuperarPass.validate();
            })
        },
        primerInicio(){      
            this.propsSeleccionaImagen = {
                dialogoPrimerInicio : true,  
                dialogoCortar: false,
                urlImagen: '',
                urlImageCortada:'',
            }            
        },       
        cambiarCorreo(){
            let self = this;
            let dialogAcualizandoCorreo =   this.$q.dialog({
                            message: 'Actualizando Correo Electrónico',
                            progress: true, // we enable default settings
                            persistent: true, // we want the user to not be able to close it
                            ok: false // we want the user to not be able to close it
                        })
            firebase.auth.signInWithEmailAndPassword(this.email, this.password)
            .then((res)=>{ 
                let user = res.user      
                this.correoAnterior = this.email;
               user.updateEmail(this.cambioEmail).then(function() {                    
                    user.sendEmailVerification().then(async ()=> {                                
                        await self.cambiaNombreImagen(self.correoAnterior)
                        console.log('ejecu')                                                 
                        self.dialogoCambioCorreo = false
                        dialogAcualizandoCorreo.hide()                    
                        firebase.auth.signOut().then(() => {}).catch((error) => {}); 
                        self.plugins.notificacion("Se ha enviado un correo de verificación de la cuenta", "positive", "", 4000);
                    }).catch((error) =>{
                      console.log(error) 
                      dialogAcualizandoCorreo.hide()                    
                    });
                    
                }).catch(function(error) {
                      dialogAcualizandoCorreo.hide()                    
                      this.mensajeError= "Ha ingresado una dirección de correo con formato no válido"
                      this.correoValido =false;
                      this.$refs.inputChangeEmail.validate()
                }); 
            })
            .catch(()=>{
                dialogAcualizandoCorreo.hide()                    
            })
        } ,
        cambiaNombreImagen(email){
            let self = this;
            console.log(email)
            console.log(self.correoAnterior)
            return new Promise ((resolve, reject)=>{ 
                this.$firebase.storage().ref().child(`avatar/${email}`).getDownloadURL().then(async (url)=>{
                let base64Img=   await self.$firebaseGetImg(url);
                    this.$firebase.storage().ref().child(`avatar/${email}`).delete().then(()=>{
                        this.$firebase.storage().ref().child(`avatar/${self.cambioEmail}`).putString(base64Img, 'data_url').then((image)=>{
                            this.$firebase.storage().ref().child(`avatar/${self.cambioEmail}`).getDownloadURL().then((url)=>{     
                                this.$firebase.auth().currentUser.updateProfile({                                    
                                        photoURL: url
                                })                       
                                resolve()
                            })   
                        })
                    })
                })
            })
        },       

    }, 
    computed:{
        ...mapState('elementosPublicos',['plugins']),
        
    }
}
</script>