<template>
  <q-page class="flex flex-center">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    > -->
    <!-- <p>img</p> -->    
     <Mapa />  
     <!----------------------------- Dialogo Iniciar Sesión -------------------------------------->
     <q-dialog v-model="mostrarDialogo" persistent>
            <q-card>
                <q-card-section class="row items-center">
                <q-avatar icon="supervised_user_circle" color="primary" text-color="white" />
                <span class="q-ml-sm">Para realizar esta acción primero debes iniciar sesión.</span>
                </q-card-section>

                <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" v-close-popup />
                <q-btn @click="$router.push('login')" label="Iniciar Sesión" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
      </q-dialog>
      <!----------------------------- Dialogo Iniciar Sesión -------------------------------------->
  </q-page>
</template>

<script>
import Mapa from 'components/mapa/Mapa.vue';
import {mapMutations} from 'vuex';
export default {    
  name: 'PageIndex',
  components: { Mapa },
  mounted(){    
    this.asignaFuncionCrearPartido(this.crearPartido)
  },
  data(){
    return{      
      ///Dialogo Login////
      mostrarDialogo: false
      ///Dialogo Login//// 
    }
  },
  methods:{
    //////////////////////////////////////////////////Gestión Partidos/////////////////////////////////////////////////////
    crearPartido(){
      this.mostrarDialogo = true;
    },
    ...mapMutations('elementosPublicos',['asignaFuncionCrearPartido']),
    //////////////////////////////////////////////////Gestión Partidos/////////////////////////////////////////////////////
  }

};
</script>
