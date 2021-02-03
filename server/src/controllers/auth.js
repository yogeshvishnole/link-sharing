import ses from '../services/aws-ses';
import User from '../models/user';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check if user already  exists
  if (!(await User.findOne({ email }))){
    return 
  }
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: { ToAddresses: [email] },
      ReplyToAddresses: [process.env.EMAIL_TO],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<html><body><h1>Hello ${name}</h1></body></html>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Complete your registration',
        },
      },
    };
  try {
    const data = await ses.sendEmail(params).promise();
    console.log('Email submitted to ses', data);
    res.send('email sent');
  } catch (err) {
    console.log('err on ses : ', err);
    res.send('Email failes');
  }
};
