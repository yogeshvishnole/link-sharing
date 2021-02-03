import AWS from './aws-sdk';

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

export default ses;
