export const environment = {
  production: false,
  // baseUrl: 'https://nxtgen.skense.ai/api/api',
  // APIEndpoint:'https://nxtgen.skense.ai/api/api',

  APIEndpoint: 'http://localhost:3000/api',
  baseUrl: 'http://localhost:3000/api',

  firebase: {
    apiKey: "AIzaSyAaRLFSEm5PpkjePhCEy57EPbMq8OAXutQ",
    authDomain: "esneks-dev.firebaseapp.com",
    projectId: "esneks-dev",
    storageBucket: "esneks-dev.appspot.com",
    messagingSenderId: "1008442334034",
    appId: "1:1008442334034:web:01f08d19e98078e58cf88b",
    vapidKey: "BJbZJHtdux0EHLJdh62iMub_k_i_RZXtY0sADfnQOLHE_nNr60-AwuxQuA1zqtP-itPhNtrtog4-y5XLU6PgzB8"
  }
};
export const LOGIN_TYPE = 'AAD'; // AAD For AAD Login and LOCAL for Local Login
export const CLIENT_ID = '654dcd05-696d-445e-9d0c-4c8f042e94f1'; //44d82f25-effb-4801-abb3-0bcb73c921ed
export const AUTHORITY = 'https://login.microsoftonline.com/common/';
export const VALIDATION_AUTHORITY = true;
export const REDIRECT_URI = 'http://localhost:4200';
export const POST_LOGOUT_REDIRECT_URI = 'http://localhost:4200';
// export const REDIRECT_URI = 'http://localhost:4200/';
// export const POST_LOGOUT_REDIRECT_URI = 'http://localhost:4200/';
export const NAVIGATION_TO_LOGIN = true;
export const SESSION_TIMEOUT = 15 * 60; //in seconds
