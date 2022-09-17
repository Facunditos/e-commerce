require('dotenv').config();
const AWS=require("aws-sdk");
const fs=require("fs");
const s3=new AWS.S3({
    accessKeyId:process.env.AWS_Access_key_ID,
    secretAccessKey:process.env.AWS_Secret_access_key,
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

const deleteFromBucket=(bucket,key)=>{
    const params={
        Bucket:bucket,
        Key:key,
    };
    return s3.deleteObject(params).promise()
};


module.exports={uploadToBucket,deleteFromBucket}