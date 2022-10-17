const nodemailer = require('nodemailer')

//Function to create the transporter and mail sender
const sendMail = async(options)=>{

    //Create the transporter
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })
    //Create the mail
    const mail =  ({
        from:`AllInPetStore 🐶 <author@gmail.com`,
        to: options.to,
        subject:options.subject,
        text:options.text
    })
    await transporter.sendMail(mail)

}

module.exports = sendMail