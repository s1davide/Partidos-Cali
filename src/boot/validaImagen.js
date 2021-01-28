async function validaURL(url) {         
    var img = new Image();
    img.src = url;
     
       return new Promise((resolve,reject)=>{
            img.onload = function(param) {
                resolve(true);
             };
             img.onerror = img.onabort =  function(param) {
                resolve(false);
            };
        })
}

export {
    validaURL
}