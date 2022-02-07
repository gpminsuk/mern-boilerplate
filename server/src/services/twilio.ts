const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_TOKEN;
const client = require('twilio')(accountSid, authToken);

export const sendVerificationSMS = async (to: String, code: String) => {
  let a = await client.messages.create({
    body: `${code} Verification Code`,
    from: '+14258008085',
    to,
  });
};
