<template>
    <!-- //////////////////////////////////////////////////Menú Sesión Iniciada///////////////////////////////////////////////////// -->
         <q-menu v-if="sesionIniciada">
        <div class="row no-wrap q-pa-md">
            <div class="column">
            <div class="text-h6 q-mb-md">Opciones</div>
                <q-item @click="setMenuConfiguracionPerfil(true)" clickable v-ripple>
                    <q-item-section avatar>
                        <q-icon color="positive" name="settings" />
                    </q-item-section>
                    <q-item-section>
                        Configuración de Perfil
                    </q-item-section>
                </q-item>
            
            </div>
            <q-separator vertical inset class="q-mx-lg" />
            <div class="column items-center">
            <q-avatar size="72px">            
                <img :src="informacionUsuario.urlImg">
            </q-avatar>
            <div class="text-subtitle1 q-mt-md q-mb-xs">{{informacionUsuario.nombreUsuario}}</div>
            <q-btn
                color="positive"
                label="Logout"
                push
                size="sm"
                v-close-popup
                @click="cerrarSesion"
            />
            </div>
        </div>
        </q-menu> 
    <!-- //////////////////////////////////////////////////Menú Sesión Iniciada///////////////////////////////////////////////////// -->
    <!-- //////////////////////////////////////////////////Menú Sesión Cerrada///////////////////////////////////////////////////// -->
        <q-menu  v-else="sesionIniciada">
                <q-list style="min-width: 200px" bordered>
                    <q-item @click="seleccionarAccionLogin('login')" clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon color="positive" name="how_to_reg" />
                        </q-item-section>
                        <q-item-section>
                            Iniciar Sesión
                        </q-item-section>
                    </q-item>
                    <q-item @click="seleccionarAccionLogin('register')" clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon color="positive" name="assignment_ind" />
                        </q-item-section>
                        <q-item-section>
                            Registrarse
                        </q-item-section>
                    </q-item>
                
                </q-list>                    
            
        </q-menu>
    <!-- //////////////////////////////////////////////////Menú Sesión Cerrada///////////////////////////////////////////////////// -->
</template>
<script>
import { seleccionarAccionLogin } from 'src/store/elementosPublicos/actions';
import * as firebase from 'boot/firebase' 
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
    created(){
        
    },    
    methods:{
        cerrarSesion(){
            firebase.auth.signOut().then(() => {
                    this.plugins.notificacion("La sesión ha sido cerrada", "positive", "",1000);
                    this.$router.go()
            }).catch((error) => {            
            }); 
        },
        
        ...mapActions('elementosPublicos',['seleccionarAccionLogin']),
        ...mapMutations('elementosPublicos',['setMenuConfiguracionPerfil']),
    },
    computed:{
        ...mapState('elementosPublicos',['sesionIniciada']),
        ...mapState('elementosPublicos',['plugins']),
        ...mapState('elementosPublicos',['informacionUsuario'])
    }

}
</script>