export const emailVerificationTemplate = token => `<html>
          <body>
          <h1>Verify your email addresss</h1>
          <p>Please use the following link to complete your registration</p>
          <p>${process.env.CLIENT_URL}/auth/verify/${token}</p>
          </body>
          </html>`;
