function sumar(numeroA,numeroB){
    return new Promise((resolve,reject)=>{
        if (typeof numeroA!=="number" ||typeof numeroB!=="number"){
            reject({message:'no se puede realizar la suma porque al menos uno de los argumentos no representa un númeor'});
        };
        resolve(numeroA+numeroB)
    })
};
sumar(45,'perro').then(resultado=>{
    console.log(resultado);
}).catch(e=>console.log(e.message))


