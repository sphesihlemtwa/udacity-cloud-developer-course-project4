// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-no12-eof.us.auth0.com',            // Auth0 domain
  clientId: 'QaDJpuJ7w5PWgayVdtOp8sHovzp4Dz7F',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
