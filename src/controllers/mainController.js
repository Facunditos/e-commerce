module.exports=(req,res)=>{
    let {faker}=require("@faker-js/faker");
    const images=Array(100)
                .fill(0)
                .map(() => {
                    return {
                        image: faker.image.cats(),
                    };
                });
    res.json(images)
};