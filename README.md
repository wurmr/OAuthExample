# OAuthExample

OAuth Api Example Project

This Project exists to show a simple use case of using OAuth Tokens (like google) to authenticate against a custom API set.

## Usage

To run the project first install all the node packages and then run gulp

```
$ npm install
$ gulp
```

### Get an access_token

Head over to the Google's [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
and select the APIs you'd like to authorize.  Proceed to step 2 and get an Access token.

Suggested APIs are `https://www.googleapis.com/auth/userinfo.profile` and `https://www.googleapis.com/auth/userinfo.email`

### Test Authorization

Issue a get request to http://127.0.0.1:3000/users/me with the `access_token` set in either the header or the query string of the request.
You should get back an object representing your Google account and it will contain what you authorized in the playground.
