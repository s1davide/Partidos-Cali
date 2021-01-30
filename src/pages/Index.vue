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
import {mapState, mapMutations} from 'vuex';
import { setDialogoCrearPartido } from 'src/store/elementosPublicos/mutations';
export default {    
  name: 'PageIndex',
  components: { Mapa },
  mounted(){    
    this.setFuncionCrearPartido(this.crearPartido)
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
    crearPartido(infoPartido){      
      if(!this.sesionIniciada){        
        this.mostrarDialogo = true;
      }else{
        this.setDialogoCrearPartido(true)
        
      }
      
    },
    ...mapMutations('elementosPublicos',['setFuncionCrearPartido']),
    ...mapMutations('elementosPublicos',['setDialogoCrearPartido']),    
    
    //////////////////////////////////////////////////Gestión Partidos/////////////////////////////////////////////////////
  },
  computed:{
    ...mapState('elementosPublicos',['sesionIniciada']),
  }

};
</script>
