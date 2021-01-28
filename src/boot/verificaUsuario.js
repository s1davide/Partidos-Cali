import * as firebase from './firebase'
function revisarEstadoLogin(params) {
    
    return new Promise((resolve,reject)=>{ 
        firebase.auth.onAuthStateChanged((user)=>{
        if(user){
            resolve(true)
        }
        else{resolve(false)}    
        })
    })
    
}
export{
    revisarEstadoLogin
}