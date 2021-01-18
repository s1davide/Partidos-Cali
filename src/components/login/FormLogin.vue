<template >
    <q-form
        class="q-gutter-md"
        @submit="loguear"
        >
        <q-input
            filled
            v-model="email"
            label="Nombre de Usuario"
            hint="Ingrese su Correo"    
            :dense="true"        
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <q-input
            filled
            type="password"
            v-model="password"
            label="Contraseña"            
            hint="Ingrese su contraseña"     
            :dense="true" 
            lazy-rules
            :rules="[
           val => val && val.length > 0 || 'El campo no puede quedar vacío',
           val =>val.length >= 6 || 'La contraseña debe tener como mínimo 6 caracteres.'    
            ]"
        />
        <div class="row justify-end">
            <q-btn label="Ingresar" type="submit" color="positive"/>
            <q-btn label="Reset" type="reset" color="positive" flat class="q-ml-sm" />
        </div>
        </q-form>
</template>
<script>
export default {
    props:{
        firebase:{
            required: false
        }
    },
    data(){
        return{
            email:'',
            password:''

        }
    },
    mounted(){
        this.prueba();   
        
    },
    methods:{
        loguear(){
            this.firebase.auth.signInWithEmailAndPassword(this.email, this.password)
            .catch((error)=>{
                console.log(error)
            })

        },
        prueba(){            
            let interval = setInterval(() => {
                if(this.firebase.auth!=undefined){
                    this.firebase.auth.signOut().then(() => {
                    // Sign-out successful.
                    }).catch((error) => {
                    // An error happened.
                    });

                    this.firebase.auth.onAuthStateChanged((user)=>{
                        if(user){
                            console.log(user)
                        }else{
                            console.log(user)
                        }
                    })
                    clearInterval(interval);
                }               
                
                }, 100);            
        }
    }
}
</script>