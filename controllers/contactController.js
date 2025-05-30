import Contact from '../models/contactModel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable for email
    pass: process.env.EMAIL_PASS, // Use environment variable for password
  },
});

// Save form and send email
export const saveContact = (req, res) => {
  const newContact = new Contact({
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    message: req.body.message,
    service: req.body.service,
  });
  newContact.save()
    .then((contact) => {
      // Email to Admin
      const adminMailOptions = {
        from: `Bellissimo Interiors Zone <process.env.EMAIL_USER />`, // Use environment variable
        to:  "process.env.ADMIN_EMAIL",
        subject: 'New Service Request Information Received',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
            <h2 style="color: #ff6600;">New Service Request from ${contact.name}</h2>
            <p>A new contact submission has been received with the following details:</p>
            <ul style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
              <li><strong>Name:</strong> ${contact.name}</li>
              <li><strong>Mobile:</strong> ${contact.mobile}</li>
              <li><strong>Email:</strong> ${contact.email}</li>
              <li><strong>Address:</strong> ${contact.address}</li>
              <li><strong>City:</strong> ${contact.city}</li>
              <li><strong>Service:</strong> ${contact.service}</li>
              <li><strong>Message:</strong> ${contact.message}</li>
            </ul>
          </div>`,
        // Removed attachments related to photo
      };

      // Email to User
      const userMailOptions = {
        from: `Bellissimo Interiors Zone <process.env.EMAIL_USER/>`, // Use environment variable
        to: contact.email,
        subject: 'Thank you for contacting Bellissimo Interiors Zone',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Thank You, ${contact.name}!</h2>
            <p>We appreciate your request for the <strong>${contact.service}</strong> service.</p>

            <ul style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
              <li><strong>Name:</strong> ${contact.name}</li>
              <li><strong>Mobile:</strong> ${contact.mobile}</li>
              <li><strong>Email:</strong> ${contact.email}</li>
              <li><strong>Address:</strong> ${contact.address}</li>
              <li><strong>City:</strong> ${contact.city}</li>
              <li><strong>Service:</strong> ${contact.service}</li>
              <li><strong>Message:</strong> ${contact.message}</li>
            </ul>
            <p>Our team will reach out to you soon to assist you with your request. If you need immediate assistance, feel free to contact us via email or phone.</p>
            <p>Best regards,</p>
            <p><strong>Bellissimo Interiors Zone Team</strong></p>
          </div>`,
        // Removed attachments related to photo
      };

      // Send emails
      transporter.sendMail(adminMailOptions, (error) => {
        if (error) {
          return res.status(500).json({ message: 'Admin email sending failed', error });
        }

        // Only send user email if admin email succeeds
        transporter.sendMail(userMailOptions, (userError) => {
          if (userError) {
            return res.status(500).json({ message: 'User email sending failed', error: userError });
          }

          res.status(200).json({ message: 'Contact saved and emails sent successfully!' });
        });
      });
    })
    .catch((saveError) => res.status(500).json({ message: 'Failed to save contact', error: saveError }));
};


export const getAllContactsController = async (req, res) => {
  try {
    const contacts = await Contact.find();
    if (!contacts || contacts.length === 0) {
      return res.status(404).send({ success: false, message: "No contacts found" });
    }
    return res.status(200).send({ success: true, contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).send({ success: false, message: error.message });
  }
};
