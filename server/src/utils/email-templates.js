export const emailVerificationTemplate = token => `<html>
          <body>
          <h1>Verify your email addresss</h1>
          <p>Please use the following link to complete your registration</p>
          <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
          </body>
          </html>`;

export const emailResetPasswordTemplate = token => `
    <html>
          <body>
          <h1>Reset your password</h1>
          <p>Please use the following link to complete reseting the password</p>
          <p>${process.env.CLIENT_URL}/auth/reset-password/${token}</p>
          </body>
          </html>
`;
