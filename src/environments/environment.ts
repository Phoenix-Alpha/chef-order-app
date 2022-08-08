// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend : {
    baseURL: 'http://halalbackendapppublic-env-1.eba-bijvq3im.eu-central-1.elasticbeanstalk.com',
  },
  aws_config: {
    aws_region: "eu-central-1",
    aws_user_pools_id: "eu-central-1_VMIoEqr2c",
    aws_user_pools_web_client_id: "4o97eqndj49gfumaolsfs766sl",
    aws_cognito_identity_pool_id: "eu-central-1:c440b9d5-288a-4205-b79e-a6632332ced0",
    aws_cognito_idp_endpoint: "https://cognito-idp.eu-central-1.amazonaws.com",
    sts_endpoint: "https://sts.amazonaws.com",
    aws_cognito_authorize_endpoint: 'https://halalhomemade.auth.eu-central-1.amazoncognito.com/oauth2/authorize',
    aws_cognito_token_endpoint: 'https://halalhomemade.auth.eu-central-1.amazoncognito.com/oauth2/token',
    aws_cognito_google_login_endpoint: "https://halalhomemade.auth.eu-central-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&client_id=4o97eqndj49gfumaolsfs766sl&response_type=code&scope=email+openid+profile+aws.cognito.signin.user.admin&redirect_uri=com.halalhomemade.app://localhost/auth/google/login", // Web Google login/signup
    aws_cognito_google_logout_endpoint: "https://halalhomemade.auth.eu-central-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&client_id=4o97eqndj49gfumaolsfs766sl&response_type=code&scope=email+openid+profile+aws.cognito.signin.user.admin&redirect_uri=com.halalhomemade.app://localhost/auth/google/logout", // Web Google Logout
    aws_cognito_facebook_login_endpoint: "https://halalhomemade.auth.eu-central-1.amazoncognito.com/oauth2/authorize?identity_provider=Facebook&client_id=4o97eqndj49gfumaolsfs766sl&response_type=code&scope=email+openid+profile+aws.cognito.signin.user.admin&redirect_uri=com.halalhomemade.app://localhost/auth/facebook/login", // Web Facebook login/signup
    aws_cognito_facebook_logout_endpoint: "https://halalhomemade.auth.eu-central-1.amazoncognito.com/oauth2/authorize?identity_provider=Facebook&client_id=4o97eqndj49gfumaolsfs766sl&response_type=code&scope=email+openid+profile+aws.cognito.signin.user.admin&redirect_uri=com.halalhomemade.app://localhost/auth/facebook/logout", // Web Facebook Logout
    aws_cognito_hosted_social_login_endpoint: "https://halalhomemade.auth.eu-central-1.amazoncognito.com/login?client_id=4o97eqndj49gfumaolsfs766sl&response_type=code&scope=email+openid+profile&redirect_uri=com.halalhomemade.app://localhost/public/home", // android
    aws_cognito_google_login_redirect_uri: 'com.halalhomemade.app://localhost/auth/google/login',
    aws_cognito_facebook_login_redirect_uri: 'com.halalhomemade.app://localhost/auth/facebook/login',
    aws_s3_bucket_name: 'halalhomemadebucket',
  },
  social: {
    googleAndroidClientId: "603530675485-6ln9l8k4se9hbmac50nlriv0sf04s5sr.apps.googleusercontent.com", // android client
    googleWebClientId: "603530675485-5jrboqsb2t71qtvhfmdv7gkredjto3fi.apps.googleusercontent.com", // web client
    facebookClientId: "3790038924399171",
  },
  stripePublishableKey: "pk_test_51IYZ9kBacowHdHsgZqK8SpJeHum3mmXSupwIbZ4693MSMmGlgsqur6BrkhtdGCHq78SSeF5o73wrIxXcavr8rAKw00BHnxQmqm",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
// ionic cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.603530675485-6ln9l8k4se9hbmac50nlriv0sf04s5sr

// ionic cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.603530675485-5jrboqsb2t71qtvhfmdv7gkredjto3fi

// <preference name="iosScheme" value="ionic" />
// <preference name="Scheme" value="ionic" />
