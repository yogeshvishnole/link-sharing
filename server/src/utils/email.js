import ses from '../services/aws-ses';
import {
  emailVerificationTemplate,
  emailResetPasswordTemplate,
  emailNewLinkTemplate,
} from './email-templates';
import {
  EMAIL_VERIFICATION_SUBJECT,
  NEW_LINK_SUBJECT,
  RESET_PASSWORD_SUBJECT,
} from './email-subjects.js';

// In this class we can use open closed principle
export default class Email {
  constructor(email, token, data = {}) {
    this.email = email;
    this.token = token;
    this.data = data;
  }

  constructParams(emailTemplateFunc, subject) {
    return {
      Source: process.env.EMAIL_FROM,
      Destination: { ToAddresses: [this.email] },
      ReplyToAddresses: [process.env.EMAIL_TO],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: emailTemplateFunc(this.token, this.data),
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
    };
  }

  async send(params) {
    return await ses.sendEmail(params).promise();
  }

  async sendEmailVerification() {
    const params = this.constructParams(
      emailVerificationTemplate,
      EMAIL_VERIFICATION_SUBJECT,
    );
    return await this.send(params);
  }

  async sendResetPassword() {
    const params = this.constructParams(
      emailResetPasswordTemplate,
      RESET_PASSWORD_SUBJECT,
    );
    return await this.send(params);
  }

  async sendNewLinkCreated() {
    const params = this.constructParams(emailNewLinkTemplate, NEW_LINK_SUBJECT);
    return await this.send(params);
  }
}
