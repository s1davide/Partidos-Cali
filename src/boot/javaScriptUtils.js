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
Vue.prototype.$toBase64 = urlImageToBase64;
Vue.prototype.$arrayB64 = arrayBufferToBase64;
Vue.prototype.$fileB64 = fileToBase64;
Vue.prototype.$firebaseGetImg = firebaseGetImg;