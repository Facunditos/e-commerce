
module.exports=(req,res)=>{
    let {faker}=require("@faker-js/faker");
    const {query}=req;
    console.log("object",query);
    const objectJSON=JSON.stringify(query);
    const objectJS=JSON.parse(objectJSON);
    console.log(objectJSON.propiedadA);
    console.log("objectJSON",objectJSON);
    console.log("objectJS",objectJS);
    /* const images=Array(100)
                .fill(0)
                .map(() => {
                    return {
                        image: faker.image.cats(),
                    };
                }); */
    res.json('https://localhost:3030/me/transactions')
};