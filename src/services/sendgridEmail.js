require("dotenv").config()
const sgMail=require("@sendgrid/mail")

const sendWelcomeEmail= async function(newUserEmail,newUserFirstName) {
    try{
        console.log(process.env.SENDGRID_API_KEY);
        console.log(process.env.SENDGRID_SENDER);
        await sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg={
            to:newUserEmail,
            from:process.env.SENDGRID_SENDER,
            subject:'Welcome',
            text:"text",
            html:`<h1>Hi ${newUserFirstName}, from e-commerce1287 app we welcome you</h1>`
        }
        return await sgMail.send(msg)    
    } catch (e) {
        console.log(e.response.body);
    }
    
};
module.exports=sendWelcomeEmail