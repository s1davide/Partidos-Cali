<template>
     <q-dialog
      v-model="propsSeleccionaImagen.dialogoCortar"
    ><!-- max-width: 80vw; -->
      <q-card style="width: 700px; ">
        <q-card-section>
          <div class="text-h6 text-center">Cortar Imagen</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-xs row justify-center">
           
           
            <div style="max-width:300px ">
                <img :src="propsSeleccionaImagen.urlImagen"
                                 style="height: 300px; max-width: 300px"
                                 class="rounded-borders"                                 
                                 ref="imageCrop"
                                > 
            </div> 
            <div class="column">
                <div class="text-h8 text-center">Vista Previa</div>
                <div style="width: 100px; height: 100px;overflow: hidden">                
                    <div  ref="vistaPrevia" style="width: 100px; height: 100px;" class="preview">                
                </div>
                </div>
            </div>              
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
            <q-btn  label="Aceptar" @click="cortarImagen" v-close-popup />
            <q-btn flat v-close-popup @click="noCortada" class="text-negative" label="Cancelar"  />          
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css'
export default {    
    props:{
        propsSeleccionaImagen:{},
        funcionesCortar:{}
    },
    
    updated(){
        const image = this.$refs.imageCrop    
        if(image!=undefined)   {
            this.cropper = new Cropper(image, {
                
                aspectRatio: 1,
                initialAspectRatio: 1,
                preview: '.preview',
                zoomable: false,
                scalable: false,
                data:{
                    width: 5000,
                    height: 5000
                },
                autocrop: true,
                crop:()=>{
                    /* const canvas = this.cropper.getCroppedCanvas(); */
                    /* this.vistaPrevia = canvas.toDataURL(canvas) */
                },
        })
        
        }            
        
    },
    mounted(){
        
    },
    data(){
        return{
            cropper:'',
        }        
    },
    methods:{
        cortarImagen(){
            let canvas = this.cropper.getCroppedCanvas();
            let urlFinalImg = canvas.toDataURL(canvas);                        
            this.funcionesCortar.seleccionadaImagenCortada(urlFinalImg)   
        },
        noCortada(){
            this.funcionesCortar.noSeleccionadaImagenCortada()
        }
    }
    
}
</script>
