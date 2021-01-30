import Vue from 'vue';
import axios from 'axios'
function urlImageToBase64(urlImg) {
        //return new Promise((resolve,reject)=>{
                let img = new Image;
                img.src= urlImg;
                img.crossOrigin = "anonymous";
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.heigth = img.heigth;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img,0,0);
                let dataURL = canvas.toDataURL('image/png');
                return dataURL
       // })                 
}
function firebaseGetImg(url) {//Firebase en base64          
        return new Promise((resolve, reject)=>{
                axios(url, {responseType: 'arraybuffer'}).then(async (image)=>{                        
                        let res =await arrayBufferToBase64(image)
                        resolve(res);                                         
                }).catch(()=>{                        
                        this.$firebase.storage().ref().child(`avatar/${this.email}`).getDownloadURL().then((url)=>{                          
                                firebaseGetImg(url)
                        })                           
                })
        })
        
}
function arrayBufferToBase64(image) {
        let buffer = image.data
        var binary = ''
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;        
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return `data:${image.headers['content-type']};base64, ${window.btoa( binary )}`;
}
function fileToBase64(file) {
        let reader=new FileReader();        
        reader.readAsDataURL(file)
        return new Promise((resolve,reject)=>{
        reader.onload = (e)=>{
                resolve(e.target.result)
        }                                      
        })
}
function convierteFecha(estilo, fechaInicial, fechaAnterior){
        let fecha;
        if(estilo=='tarjeta'){
                let date = new Date(fechaInicial)
                let hora = date.toLocaleString('en-US', {hour: 'numeric', hour12: true}).split(' ')
                let minutos = date.getMinutes()<10? 0+date.getMinutes().toString():date.getMinutes();
                let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 
                'Mayo', 'Junio', 'Julio', 'Agosto', 
                'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                fecha = `${meses[date.getMonth()]} ${date.getDate().toString()}, ${date.getFullYear()} 
                ${hora[0]}:${minutos} ${hora[1]}`            
        }     
        else if(estilo.substring(0, 3)=='fix'){
                let date = new Date(fechaInicial)  
                let fechaGuardada = new Date(fechaAnterior);                             
                if(estilo=='fixHour'){            
                let hora = date.toLocaleString('en-US', {hour: 'numeric', hour12: true}).split(' ');
                let minutos = date.getMinutes()<10? 0+date.getMinutes().toString():date.getMinutes();     
                fecha = `${fechaGuardada.getFullYear()}/${(date.getMonth()+1)<9?'0':''}${date.getMonth()+1}/${fechaGuardada.getDate().toString()} ${hora[0]<9?'0':''}${hora[0]}:${minutos} ${hora[1]}`
                }
                else{
                let hora = fechaGuardada.toLocaleString('en-US', {hour: 'numeric', hour12: true}).split(' ');
                let minutos = fechaGuardada.getMinutes()<10? 0+fechaGuardada.getMinutes().toString():fechaGuardada.getMinutes();     
                fecha = `${date.getFullYear()}/${(date.getMonth()+1)<9?'0':''}${date.getMonth()+1}/${date.getDate().toString()} ${hora[0]<9?'0':''}${hora[0]}:${minutos} ${hora[1]}`
                }
                
        }
        else{
                let date = new Date(fechaInicial)        
                let hora = date.toLocaleString('en-US', {hour: 'numeric', hour12: true}).split(' ');
                let minutos = date.getMinutes()<10? 0+date.getMinutes().toString():date.getMinutes();                
                fecha = `${date.getFullYear()}/${(date.getMonth()+1)<9?'0':''}${date.getMonth()+1}/${date.getDate().toString()} ${hora[0]<9?'0':''}${hora[0]}:${minutos} ${hora[1]}`      

        }
        return fecha;
}

Vue.prototype.$toBase64 = urlImageToBase64;
Vue.prototype.$arrayB64 = arrayBufferToBase64;
Vue.prototype.$fileB64 = fileToBase64;
Vue.prototype.$firebaseGetImg = firebaseGetImg;
Vue.prototype.$convertirFecha = convierteFecha;

