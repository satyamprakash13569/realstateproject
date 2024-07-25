import User from "@/models/User";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"
export async function sendEmail({email,emailType,userId}){
    try{
    var mailoptions={
        from:'satyams.ug21.ec@nitp.ac.in',
        to:email,
    };
    const hashedToken=await bcrypt.hash(userId.toString(),10);
    if(emailType==="RESET"){
        const user=await User.findOneAndUpdate({email},{
            forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now()+3600000
        });
        mailoptions.subject="Reset your password";
        mailoptions.html=`<p><a href="${process.env.DOMAIN}/resetPassword/${hashedToken}">click</a> to reset your password </p><p>If you did not request this password reset,please ignore this email.</p><p>Your account security is important to us.</p></br><p>Thank you.</p><p>SatyamEstate Team.</p>`
    }
    else if(emailType==="WELCOME"){
        mailoptions.subject="welcome to satyamEstate.";
        mailoptions.html=`<p>Welcome to satyam Estate.</p>`
    }
    // create a transporter
    var transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 2525,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });
    // host mail_host refers to the domain name of the mail server that we want to use for sending emails;
    // send email
    const mailResponse=await transporter.sendMail(mailoptions);
    return mailResponse;
    }catch(error){
        throw new Error(error.message);
    }
}