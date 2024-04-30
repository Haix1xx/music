const { S3 } = require('aws-sdk');
const uuid = require('uuid').v4;

exports.s3UploadFile = async (file) => {
    const s3 = new S3();

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `tracks/${uuid()}-${file.originalname}`,
        Body: file.buffer,
        // ACL: 'public-read',
    };
    const result = await s3.upload(params).promise();

    return result;
};
