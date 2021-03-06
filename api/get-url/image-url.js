const aws = require('aws-sdk');

// Update config with creds pulled into memory by vercel env vars
aws.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_BS,
	secretAccessKey: process.env.AWS_SECRET_KEY_BS,
	region: process.env.AWS_BUCKET_REGION_BS
})

const s3 = new aws.S3();
export default function handleEvent(req,res){
	try{
		const myBucket = process.env.AWS_BUCKET_NAME_BS
		const myKey = 'background.png'
		const signedUrlExpireSeconds = 60 * 60

		// Create a presigned URL for a potential object named background.png {myKey}
		const url = s3.getSignedUrl('getObject', {
			Bucket: myBucket,
			Key: myKey,
			Expires: 60,
			ResponseContentType:'image/png'
		})
		res.json({url:url});
		}catch(err){
			res.json({error:err})
	}
}