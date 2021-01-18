<template>
  <div id="q-app">
    <router-view :notificacion="notificacion" />
  </div>
</template>
<script>
import { Notify } from 'quasar';
export default {
  name: 'App',
  data(){
    return{
      notificacion: ''
    }
  },
  mounted(){
    this.notificacion = this.notify
  },
  methods:{
    notify(mensaje, color, icon, duracion){
            this.$q.notify({
                message: mensaje,
                color: color,
                icon: icon,
                position: 'top',
                timeout: duracion
            })
        },        
  }
};
</script>
