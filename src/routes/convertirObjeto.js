const fs=require("fs");

function convertirEnObjeto(req) {
    console.log(req.files);
    const {perro}=req.body;
    console.log(perro*10);
    
    return req;
};

module.exports=convertirEnObjeto