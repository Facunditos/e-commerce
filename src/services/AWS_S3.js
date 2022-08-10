require('dotenv').config()
const fs=require("fs");
const AWS=require("aws-sdk");

const s3=new AWS.S3({
    accessKeyId:process.env.AWS_accessKeyId,
    secretAccessKey:process.env.AWS_secretAccessKey,
    region:process.env.AWS_region
});

const uploadToBucket=(bucket,key,file)=>{
    const stream=fs.createReadStream(file.tempFilePath);
    const params={
        Bucket:bucket,
        Key:key,
        Body:stream
    };
    return s3.upload(params).promise()
};
module.exports=uploadToBucket