<template>
  <q-page class="flex flex-center">
    <!-- <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    > -->
    <!-- <p>img</p> -->
     <Mapa :notificacion="notificacion"/>    
  </q-page>
</template>

<script>
import Mapa from 'components/mapa/Mapa.vue';
export default {  
  props:{
    notificacion:{}
  },
  name: 'PageIndex',
 components: { Mapa }
};
</script>
