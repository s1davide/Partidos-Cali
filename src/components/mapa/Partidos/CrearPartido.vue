<template>
      <q-dialog
      v-model="dialogoCrearPartido"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section >
          <div class="row q-ml-sm">
          <q-avatar size="30px" class="q-mr-sm">
            <img :src="logo">
          </q-avatar>
          <div class="text-h6">Nuevo Partido</div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="column flex-center">
          <q-form
                class="q-gutter-md"
                @submit="crearPartido"
                style="max-width: 646px; width: 100%;"
                >                        
                <q-input
                    filled
                    v-model="direccionPartido"
                    label="Dirección del lugar *"                                    
                    hint="Ingrese la dirección del lugar"
                    :dense="true"
                    lazy-rules
                    autofocus
                    :rules="[ 
                    val => val && val.length > 0 || 'El campo no puede quedar vacío',
                    
                    ]"
                />
                <q-input
                    filled
                    v-model="nombrePartido"
                    label="Nombre del Partido"
                    hint="Asigne un nombre al partido "
                    :dense="true"
                    lazy-rules
                    :rules="[ 
                        val => val && val.length > 0 || 'El campo no puede quedar vacío',
                        val => val.length <= 20 || 'El nombre de usuario debe tener un máximo de 20 caracteres.',
                    ]"
                /> 
                <!-- ///////////////////////////////////////////Input Fecha///////////////////////////////////////////////////// -->
                    <q-input  ref="intent" dense filled v-model="fechaPartido">
                      <template  v-slot:prepend>
                        <q-icon  name="event" class="cursor-pointer">
                          <q-popup-proxy  transition-show="scale" transition-hide="scale">
                            <q-date  color="positive" ref="inputFecha" @input="cerrarSelectorFecha('date', $event, fechaPartido)" v-model="fechaPartido"  mask="YYYY/MM/DD HH:mm A" today-btn :format24h="false">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup id="closeDate" label="Close" color="positive" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>

                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time color="positive" ref="inputHora" @input="cerrarSelectorFecha('hour', $event, fechaPartido)" v-model="fechaPartido" mask="YYYY/MM/DD HH:mm A" :format24h="false">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup id="closeHour" label="Close" color="positive" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>       
                <!-- ///////////////////////////////////////////Input Fecha///////////////////////////////////////////////////// -->
                  <q-input label="Cantidad de Asistentes Máximo"
                   dense filled type="number" v-model.number="maximoAsistentes" lazy-rules=""
                  :rules="[ 
                        val => val != '' || 'El campo no puede quedar vacío',
                        val => val>= 4 || 'Deben permitirse al menos 4 personas.',
                    ]"
                  />
                   <q-input
                    v-model="observaciones"
                    filled label="Información Adicional sobre el partido"
                    type="textarea"
                    :rules="[
                      val => val.length>0|| 'El Campo no puede quedar vacío'
                    ]"
                  />
                <div class="row justify-end">
                    <q-btn label="Aceptar" type="submit" color="positive"/>
                    <q-btn  @click="dialogoCrearPartido=false" label="Cancelar" color="positive" flat class="q-ml-sm" />
                </div>
            </q-form>
          </div>
        </q-card-section>

      </q-card>
    </q-dialog>
</template>
<script>
import {mapState} from 'vuex'
export default {    
    data(){
        return{
          iniciado:false,
          ///////////////InfoPartido///////////////
          nombrePartido:'',
          direccionPartido: '',
          fechaPartido:'',
          maximoAsistentes: 4,
          observaciones: ''
          ///////////////InfoPartido///////////////
        }
    },
    mounted(){
      
      
    },
    updated(){
      this.$nextTick(()=>{
        if(this.iniciado==false){
          this.fechaPartido= this.$convertirFecha('',Date.now())
          this.iniciado=true
          this.direccionPartido = this.informacionPartido.direccion
          this.nombrePartido=''
          this.fechaPartido=''
          this.maximoAsistentes= 4
          this.observaciones= ''
        }
        
      })
    },
    methods:{
      ponerFechaActual(){
        
      },
      crearPartido(){
        var refDbPartidos = this.$firebase.database().ref('partidos/')
        
        let datosPartido={
          nombre: this.nombrePartido,
          direccion: this.direccionPartido,
          fecha: this.fechaPartido,
          usuario: this.informacionUsuario.nombreUsuario,
          maximoAsistentes: this.maximoAsistentes,
          observaciones: this.observaciones,
          email: this.informacionUsuario.email,
          ubicacion: this.informacionPartido.latlng,
          asistentes: [{nombreUsuario: this.informacionUsuario.nombreUsuario,
                        email :this.informacionUsuario.email
          }]
        }
        refDbPartidos.push().set(datosPartido)
        this.dialogoCrearPartido=false

      },
      cerrarSelectorFecha(input, value){        
        let newValue = value.substring(0,value.length-3)
        let newBefore = this.fechaPartido.substring(0,value.length-3)        
        if(input=='hour'){                
                this.fechaPartido = this.$convertirFecha('fixHour', newValue, newBefore);
                document.querySelector('#closeHour').click()
        }
        else{
                this.fechaPartido = this.$convertirFecha('fixDate', newValue, newBefore);
                document.querySelector('#closeDate').click()
        }                   
        
    },
    },
    computed:{
        dialogoCrearPartido:{
            get(){
                return this.$store.state.elementosPublicos.dialogoCrearPartido
            },
            set(value){
                this.$store.commit('elementosPublicos/setDialogoCrearPartido',value)
            },
        },
        ...mapState('elementosPublicos',['informacionPartido']),
        ...mapState('elementosPublicos',['informacionUsuario']),
        ...mapState('elementosPublicos',['logo']),
    }

}
</script>