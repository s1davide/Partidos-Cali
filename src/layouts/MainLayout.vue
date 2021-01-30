<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-positive">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          <q-avatar size="30px" class="q-mr-sm">
            <img src="../assets/img/balon2.png">
          </q-avatar>
          <strong>Partidos Cali </strong>
        </q-toolbar-title>
        <!-- ///////////////////////////////////////Avatar y menu Usuario//////////////////////////////////// -->
        <q-btn no-caps :round="this.$q.screen.xs" class="btnUserCompleto" flat> 
          <!-- //////////////////////////////Avatar y menu Usuario-Con sesión Iniciada//////////////////////////////// -->
          <div v-if="sesionIniciada" class="row items-center q-gutter-sm" >                      
           <q-avatar size="42px">
              <img :src="informacionUsuario.urlImg">            
            </q-avatar>                  
            <div :hidden="this.$q.screen.xs"><strong >{{informacionUsuario.nombreUsuario}}</strong></div>            
          </div>
          <!-- //////////////////////////////Avatar y menu Usuario-Con sesión Iniciada//////////////////////////////// -->
          <!-- //////////////////////////////Avatar y menu Usuario-Con sesión Cerrada//////////////////////////////// -->
          <div v-else-if="!sesionIniciada" class="row items-center q-gutter-sm" >          
            <q-avatar size="42px" class="bg-positive" top avatar>
                <q-icon style="top: -3.2px" size="49px" name="account_circle" />    
            </q-avatar> 
            <div :hidden="this.$q.screen.xs"><strong >Loguearse</strong></div>  
          </div>
          <!-- //////////////////////////////Avatar y menu Usuario-Con sesión Cerrada//////////////////////////////// -->
          <Menu />          
        </q-btn>
        <!-- ///////////////////////////////////////Avatar y menu Usuario//////////////////////////////////// -->        
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <ConfiguracionPerfil/>
    <CrearPartido/>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue';
import Menu from 'components/barraNavegacion/Menu.vue'
import ConfiguracionPerfil  from 'components/barraNavegacion/ConfiguracionPerfil.vue'
import CrearPartido from 'components/mapa/Partidos/CrearPartido'
import {mapState} from 'vuex'
const linksData = [];

export default {
  name: 'MainLayout',  
  
  components: { EssentialLink, Menu, ConfiguracionPerfil, CrearPartido},
  setup () {
    const leftDrawerOpen = ref(false)
  },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,      
    };
  },
  computed:{
    ...mapState('elementosPublicos',['sesionIniciada']),
    ...mapState('elementosPublicos',['informacionUsuario'])
  }
  
};
</script>