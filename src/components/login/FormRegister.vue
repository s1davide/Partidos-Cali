<template >
    <q-form
        class="q-gutter-md"
        @submit="registrar"
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
            type="password"    
            v-model="password"
            label="Contraseña *"
            hint="Ingrese la contraseña para la nueva cuenta"
            :dense="true"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'El campo no puede quedar vacío',
                   val =>val.length >= 6 || 'La contraseña debe tener como mínimo 6 caracteres.'     
            ]"
        />        
        <q-input
            filled
            type="password"            
            v-model="password2"
            label="Confirmar Contraseña *"                        
            hint="Ingrese la contraseña nuevamente"            
            :dense="true"
            lazy-rules
            :rules="[
             val => val && val.length > 0 || 'El campo no puede quedar vacío',
            val => val == password || 'La contraseña no coincide con la confirmación.',            
            ]"
        />
        <div class="row justify-end">
            <q-btn label="Registrarse" type="submit" color="positive"/>
            <q-btn  @click="$router.push('/')" label="Cancelar" color="positive" flat class="q-ml-sm" />
        </div>
    </q-form>
</template>
<script>
import login from 'pages/Login.vue'
import * as firebase from 'boot/firebase' 
import {mapState} from 'vuex'
export default {    
    mounted(){        
        this.notificacion = this.plugins.notificacion
        /* console.log(this.$store.state.elementosPublicos.form) */
    },
    data(){
        return{            
            email: '',
            password:'',
            password2:'',
            notificacion: ''
        }
    },
    methods:{
        registrar(e){            
            /* e.preventDefault() */
            firebase.auth.createUserWithEmailAndPassword(this.email, this.password)
            .then(()=>{
                this.enviarCorreoVerificacion();
            })
            .catch((error)=>{
                console.log(error)
            })
        },
        enviarCorreoVerificacion(){
            let user = firebase.auth.currentUser;
            user.sendEmailVerification()
            .then(()=>{
                this.notificacion("Se ha enviado un correo de verificación de la cuenta", "positive", "", 2000);
                this.email='';
                this.password='';
                this.password2='';
                this.form = 'login'
            },(error)=>{
                console.log(error);
            })
        },        
    },
    computed:{        
        form:{
            get(){
                return this.$store.state.elementosPublicos.form
            },
            set(value){
                this.$store.commit('elementosPublicos/modificaForm',value);
            }
        },
        ...mapState('elementosPublicos',['plugins'])
    } 
}
</script>