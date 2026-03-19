import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendDriveAlert = async ({ to, name, companyName, role, date, applyLink }) => {
  await transporter.sendMail({
    from: `PlacePrep <${process.env.EMAIL_USER}>`,
    to,
    subject: `📢 ${companyName} is hiring! — PlacePrep Drive Alert`,
    html: `
      <h2>Hi ${name}!</h2>
      <p><strong>${companyName}</strong> has opened placements for <strong>${role}</strong>.</p>
      <p><strong>Drive Date:</strong> ${date}</p>
      ${applyLink ? `<p><a href="${applyLink}">Apply Here</a></p>` : ''}
      <p>Head to PlacePrep and start your ${companyName} track now!</p>
    `,
  });
};

export const sendEnrollmentConfirmation = async ({ to, name, trackTitle, companyName }) => {
  await transporter.sendMail({
    from: `PlacePrep <${process.env.EMAIL_USER}>`,
    to,
    subject: `Enrollment confirmed — ${companyName} track`,
    html: `
      <h2>You're enrolled, ${name}!</h2>
      <p>Your access to <strong>${trackTitle}</strong> (${companyName}) is now active.</p>
      <p>Good luck with your placement prep!</p>
    `,
  });
};

export const sendWelcome = async ({ to, name }) => {
  await transporter.sendMail({
    from: `PlacePrep <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to PlacePrep!',
    html: `<h2>Welcome, ${name}!</h2><p>Your placement journey starts now. Pick a company and start prepping!</p>`,
  });
};