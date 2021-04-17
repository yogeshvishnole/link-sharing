export const emailVerificationTemplate = (token = '', data = {}) => `<html>
          <body>
          <h1>Verify your email addresss</h1>
          <p>Please use the following link to complete your registration</p>
          <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
          </body>
          </html>`;

export const emailResetPasswordTemplate = (token = '', data = {}) => `
    <html>
          <body>
          <h1>Reset your password</h1>
          <p>Please use the following link to complete reseting the password</p>
          <p>${process.env.CLIENT_URL}/auth/reset-password/${token}</p>
          </body>
          </html>
`;

export const emailNewLinkTemplate = (token = '', data = {}) => `

   <html>
                            <h1>New link published </h1>
                            <p>A new link titled <b>${
                              data.title
                            }</b> has been just publihsed in the following categories.</p>
                            
                            ${data.categories
                              .map(c => {
                                return `
                                    <div>
                                        <h2>${c.name}</h2>
                                        <img src="${c.image.url}" alt="${c.name}" style="height:50px;" />
                                        <h3><a href="${process.env.CLIENT_URL}/links/${c.slug}">Check it out!</a></h3>
                                    </div>
                                `;
                              })
                              .join('-----------------------')}

                            <br />

                            <p>Do not with to receive notifications?</p>
                            <p>Turn off notification by going to your <b>dashboard</b> > <b>update profile</b> and <b>uncheck the categories</b></p>
                            <p>${process.env.CLIENT_URL}/user/profile/update</p>

                        </html>

`;
