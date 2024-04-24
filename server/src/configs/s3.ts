import { S3Client } from "@aws-sdk/client-s3";

console.log( process.env.S3_ENDPOINT!);

export const s3_client = new S3Client({
    endpoint: process.env.S3_ENDPOINT!, 
    forcePathStyle: true, 
    region: "us-east-1", 
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!, 
      secretAccessKey: process.env.S3_SECRET_KEY!, 
    },
    
});



