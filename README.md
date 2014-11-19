# OAuthExample

OAuth Api Example Project

This Project exists to show a simple use case of using OAuth (google) and SAML (adfs) Tokens to authenticate against a custom API set.

## Getting Started

To run the project first install all the node packages and then run gulp

```
$ npm install
$ gulp
```

## Google Api Usage

Part of this project demonstrates how to authenticate an API call with a google access token

### Get an access_token

Head over to the Google's [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
and select the APIs you'd like to authorize.  Proceed to step 2 and get an Access token.

Suggested APIs are `https://www.googleapis.com/auth/userinfo.profile` and `https://www.googleapis.com/auth/userinfo.email`

### Test Authorization

Issue a get request to http://127.0.0.1:3000/users/me with the `access_token` set in either the header or the query string of the request.
You should get back an object representing your Google account and it will contain what you authorized in the playground.

## SAML Usage

Or can use this project to demo making an API call with a SAML token issued from ADFS

### Setup SAML configuration

* `thumbprint` is the thumbprint of the trusted public key (uses the public key that comes in the assertion).
* `audience` (optional). If it is included audience validation will take place.

```json
"samlSettings": {
  "thumbprint": "--PutYourThumbPrintHere--",
  "audience": "--PutYourHostNameHere--"
}
```

### Get a SAML token from ADFS

Head to your ADFS server and create a `POST` to `https://adfs.yourserver.com/adfs/services/trust/13/usernamemixed`. To simulate a SOAP request. Make sure to set your content-type header as well.

```
Url: https://adfs.yourserver.com/adfs/services/trust/13/usernamemixed
Method: POST
Content-Type: application/soap+xml; charset=utf-8
```

```xml
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <s:Header>
        <a:Action s:mustUnderstand="1">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</a:Action>
        <a:To s:mustUnderstand="1">https://adfs.yourserver.com/adfs/services/trust/13/UsernameMixed</a:To>
        <o:Security s:mustUnderstand="1" xmlns:o="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" >
            <o:UsernameToken u:Id="uuid-6a13a244-dac6-42c1-84c5-cbb345b0c4c4-1">
                <o:Username>username</o:Username>
                <o:Password>password</o:Password>
            </o:UsernameToken>
        </o:Security>
    </s:Header>
    <s:Body>
        <trust:RequestSecurityToken xmlns:trust="http://docs.oasis-open.org/ws-sx/ws-trust/200512">
            <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
                <a:EndpointReference>
                    <a:Address>https://localhost:3000</a:Address>
                </a:EndpointReference>
            </wsp:AppliesTo>
            <trust:KeyType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Bearer</trust:KeyType>
            <trust:RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</trust:RequestType>
            <trust:TokenType>urn:oasis:names:tc:SAML:2.0:assertion</trust:TokenType>
        </trust:RequestSecurityToken>
    </s:Body>
</s:Envelope>

```

When you get the response extract the entire `<Assertion/>` node from the XML making no changes to it (__don't reformat it!__).  This is your SAML assertion.

### Encode the SAML Assertion in base64

You can use any tool you would like to encode the SAML into a base64 string. To make your life easier this project provides an endpoint called `/encode` that takes in anything in `text/plain` format and returns a base64 encoded string.

### Test SAML Token Authorization

Make a HTTP request as follows, replacing `{token}` with your base64 encoded SAML token from the previous step.

```
Url: http://localhost:3000/users/me/saml
Method: GET
Authorization: Bearer {token}
```

If everything works correctly you should get back in the response an object that represents all of your claims. Something like this:

```json
{
  "http://schemas.xmlsoap.org/claims/CommonName":"Jane Doe",
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "a@b.c",  
}
```
