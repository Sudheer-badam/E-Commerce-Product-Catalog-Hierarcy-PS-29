const nodemailer = require('nodemailer');

async function main() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'badamsudheerreddy@gmail.com',
      pass: 'nzwszcrzunlxlxva',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"ShopSmart Admin" <badamsudheerreddy@gmail.com>`,
      to: 'badamsudheerreddy@gmail.com', // sending to self to test
      subject: 'Test Email',
      text: 'This is a test email from the script.',
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

main();
