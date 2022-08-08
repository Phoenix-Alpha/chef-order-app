import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import * as aws from "aws-sdk";
import { CognitoAuthService } from './auth/cognito-auth.service';

// Load the required clients and packages
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";


@Injectable( { providedIn: 'root' } )
export class S3Service {
  
  constructor(private cognitoAuthService: CognitoAuthService) {}

  upload(image, imageName, accessToken, idToken) {
    return new Promise((resolve, reject) => {

      // Set the AWS Region
      const REGION = environment.aws_config.aws_region; //REGION

      // Initialize the Amazon Cognito credentials provider
      const s3 = new S3Client({
        region: REGION,
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: REGION }),
          identityPoolId: environment.aws_config.aws_cognito_identity_pool_id, // IDENTITY_POOL_ID
        }),
      });

      const bucketName = environment.aws_config.aws_s3_bucket_name; //BUCKET_NAME

      const uploadParams = {
        Bucket: bucketName,
        Key: "test-key",
        Body: image,
        ContentEncoding: "base64",
        ContentType: "image/jpeg"
      }
      
      s3.send(new PutObjectCommand(uploadParams)).then(data => {
        console.log(data);
      }).catch(err => {
        console.log(err);
      })

      // aws.config.region = environment.aws_config.aws_region;
      
      // // aws.config.credentials = new aws.CognitoIdentityCredentials({
      // //   IdentityPoolId: environment.aws_config.aws_cognito_identity_pool_id,
      // //   Logins: {
      // //     'cognito-idp.eu-central-1.amazonaws.com/eu-central-1_VMIoEqr2c': accessToken
      // //   }
      // // });
      // this.cognitoAuthService.cognitoUtil.buildCognitoCreds(idToken)
      // console.log(this.cognitoAuthService.cognitoUtil.getCognitoCreds())
      // aws.config.credentials = this.cognitoAuthService.cognitoUtil.getCognitoCreds();

      // var s3 = new S3({
      //   apiVersion: "2006-03-01",
      //   params: { Bucket: environment.aws_config.aws_s3_bucket_name },
      // });

      // var data = {
      //   Bucket: environment.aws_config.aws_s3_bucket_name,
      //   Key: imageName,
      //   Body: image,
      //   ContentEncoding: "base64",
      //   ContentType: "image/jpeg"
      // };
  
      // s3.putObject(data, (err, res) => {
      //   if (err) {
      //     console.log(err)
      //     reject(err);
      //   } else {
      //     console.log(res)
      //     resolve(res);
      //   }
      // });
    });
  }
}