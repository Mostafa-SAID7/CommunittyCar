
https://localhost:7144/api
### Authentication
Most endpoints require Bearer Token authentication (JWT).  

- [Auth API](#auth-api)                     
   POST/api/Auth/login                      - [Login](#post-apiauthlogin)    
   POST/api/Auth/register                   - [Register](#post-apiauthregister)
   POST/api/Auth/generate-otp               - [Generate OTP](#post-apiauthgenerate-otp)
   POST/api/Auth/verify-otp                 - [Verify OTP](#post-apiauthverify-otp)
   POST/api/Auth/social-login               - [Social Login](#post-apiauthsocial-login)
   POST/api/Auth/refresh-token              - [Refresh Token](#post-apiauthrefresh-token)
   POST/api/Auth/logout                     - [Logout](#post-apiauthlogout)
   POST/api/Auth/enable-2fa                 - [Enable 2FA](#post-apiauthenable-2fa)
   POST/api/Auth/disable-2fa                - [Disable 2FA](#post-apiauthdisable-2fa)
   POST/api/Auth/reset-password             - [Reset Password](#post-apiauthreset-password)
   POST/api/Auth/verify-email               - [Verify Email](#post-apiauthverify-email)
- [Profile API](#profile-api)
  - [Get My Profile](#get-apiprofileme)
  - [Get User by Id](#get-apiprofileuserid)
  - [Create Profile](#post-apiprofile)
  - [Update Profile](#put-apiprofile)
  - [Delete Profile](#delete-apiprofile)
  - [Upload Profile Picture](#post-apiprofileprofile-picture)
  - [Delete Profile Picture](#delete-apiprofileprofile-picture)
  - [Upload Cover Photo](#post-apiprofilecover-photo)
  - [Delete Cover Photo](#delete-apiprofilecover-photo)