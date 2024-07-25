import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export async function sendVerificationEmail(email){
    try{
    var mailoptions={
        from:'satyams.ug21.ec@nitp.ac.in',
        to:email,
    };
    mailoptions.subject="Verify your email.";
    mailoptions.html=`<p> <a href="${process.env.DOMAIN}/verifyEmail?email=${email}">click</a> to verify your email.</p>
    <p>SatyamEstate forces new users to verify their email to prevent any security related issues with them</p>`
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
export async function POST(req){
    try{
    const email=await req.json();
    const res=await sendVerificationEmail(email);
    return NextResponse.json({
        status:200,
        success:true,
        res,
        message:"Verification email is sent successfully"
    })
    }catch(error){
        return NextResponse.json({
            status:500,
            success:false,
            message:"Error occured while sending verification email."+error.message
        })
    }
}