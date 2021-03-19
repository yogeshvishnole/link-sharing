import ses from '../services/aws-ses';
import { emailVerificationTemplate } from './email-templates';
import { EMAIL_VERIFICATION_SUBJECT } from './email-subjects.js';

// In this class we can use open closed principle
export default class Email {
  constructor(email, token) {
    this.email = email;
    this.token = token;
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
            Data: emailTemplateFunc(this.token),
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
}
