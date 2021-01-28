<template>
    <q-layout v-if="mostrarLogin">
        <q-page-container>            
            <q-page padding class="column">
                <div class="row contTitulo" style="margin: auto; margin-bottom:35px; margin-top:0; align-items: center;">
                    <h5 class=" titulo" >Partidos Cali</h5>    
                    <q-img class="titulo" src="../assets/img/balon2.png" style="height: 100px; width: 100px; margin-left: 30px" ></q-img>
                </div>
                <div style="margin:auto; margin-top:0; max-width: 596px;
                width: 90%; 
                "  >
                <q-btn-toggle
                v-model="form"
                spread
                no-caps
                toggle-color="positive"
                color="white"
                text-color="black"
                :options="options"    
                @click="form =='login'?alturaCarousel='250px':alturaCarousel='300px'" 
                class="noBRadiusUpDown"                  
                />
            <q-card class="my-card noBRadiusUp">
            <q-card-section>
                    <q-carousel
                    v-model="form"
                    transition-prev="scale"
                    transition-next="scale"
                    animated
                    control-color="primary"
                    class="rounded-borders"
                    :height="alturaCarousel"
                    >
                        <q-carousel-slide name="login" class="column no-wrap flex-center">
                        <FormLogin style="max-width: 596px; width: 100%;"/>
                        </q-carousel-slide>
                        <q-carousel-slide name="register" class="column no-wrap flex-center">
                        <FormRegister style="max-width: 596px; width: 100%;"/>
                        </q-carousel-slide>
                    </q-carousel>
            </q-card-section>      
            </q-card>
            </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>
<script>
import FormLogin from 'components/login/FormLogin.vue';
import FormRegister from 'components/login/FormRegister.vue';
import {mapState, mapMutations} from 'vuex';
export default {    
    data(){
        return{
            options:[
                {label: 'Loguearse', value: 'login'},
                {label: 'Registrarse', value: 'register'}
            ],
            /* form: 'login', */
            alturaCarousel: '250px',      
            ///////
            mostrarLogin:false,       
        }        
    },    
    components:{FormLogin,
                FormRegister
    },   
    mounted(){
        this.form=="register"?this.alturaCarousel = "300px":this.alturaCarousel = "250px"        
        if(this.$route.path=='/login' && this.sesionIniciada){            
            this.$router.push('/')
            this.plugins.notificacion('Ya ha iniciado sesión.', "negative", "", 3000) 
            
        }        
        else{
            this.mostrarLogin = true
        }
    },    
    computed:{        
        form:{
            get(){
                return this.$store.state.elementosPublicos.form
            },
            set(value){
                this.$store.commit('elementosPublicos/modificaForm',value);
            },         
        },
        ...mapState('elementosPublicos',['sesionIniciada']),
        ...mapState('elementosPublicos',['plugins'])
    } 
    
}
</script>
<style lang="stylus">
    @import url('https://fonts.googleapis.com/css2?family=PT+Sans&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Yusei+Magic&display=swap');
    @media (max-width: $breakpoint-xs-max) {
    .titulo{
        font-size: 6vw !important;
 
    }   
    .contTitulo{
        margin-bottom:60px !important;
        margin-top: 80px !important; 
    }
  }
    .titulo{
        font-family: 'Yusei Magic', sans-serif; 
        font-weight: bold;
        font-size: 40px;
    }
  .noBRadiusUp{
    border-top-left-radius:  0;
    border-top-right-radius: 0;
  }
  .noBRadiusUpDown{
    border-bottom-left-radius:  0;
    border-bottom-right-radius: 0;
  }
  
</style>