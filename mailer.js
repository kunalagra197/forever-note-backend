const nodemailer = require("nodemailer");
const Notes = require("./models/Notes"); 
const moment = require("moment");
const email="kunalagra0197@gmail.com";
const password="fclkvkwoedhswthf";


const mailer = async () => {
  try {
    // Fetch events from the database
    const events = await Notes.find({});

    // Get tomorrow's date
    const tomorrow = moment().add(1, "day").startOf("day");
    // console.log(tomorrow)

    // Filter events happening tomorrow
    const tomorrowEvents = events.filter((event) =>
      moment(event.date).isSame(tomorrow, "day")
    );

    // Rest of the nodemailer code to send emails using the tomorrowEvents data
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password
      }
    });

    console.log("mailsent");

    // Process the tomorrowEvents data and send emails 
    tomorrowEvents.forEach(async (event) => {
      
        const info = await transporter.sendMail({
          from: '<kunalagra0197@gmail.com>',
          to: `${event.email}`,
          subject: "Note Reminder: Tomorrow's Event",
          text: `Reminder of your note title: ${event.title} happening tomorrow at ${event.date}.`,
          html: `Description of your scheduled note : ${event.description}.`,
        });
        // console.log(`Email sent for event: ${event.title} to ${registration.email}
  });

    console.log('Emails sent successfully');
  }
   catch (error) {
    console.error('Failed to send emails:', error);
  }
};

module.exports = mailer;