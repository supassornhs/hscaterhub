import nodemailer from 'nodemailer';
import { getDoc, doc } from "firebase/firestore";
import * as dotenv from 'dotenv';
dotenv.config();

export async function sendAlertEmail(db, platformName) {
    console.log(`✉️ Preparing Alert Email for broken crawler: ${platformName}`);

    // Try fetching credentials from dashboard first
    const crawlerDoc = await getDoc(doc(db, 'system', 'crawlers'));
    const emailStr = crawlerDoc.exists() ? crawlerDoc.data()['Email Source']?.cookie : null;

    let emailUser = process.env.EMAIL_USER;
    let emailPass = process.env.EMAIL_APP_PASSWORD;

    if (emailStr && emailStr.includes(',')) {
        const parts = emailStr.split(',');
        emailUser = parts[0].trim();
        emailPass = parts[1].trim();
    }

    if (!emailUser || !emailPass) {
        console.warn(`[WARNING] Could not send alert email for ${platformName} - Missing Email credentials!`);
        return;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        const mailOptions = {
            from: `"HSCaterHub Automation" <${emailUser}>`,
            to: 'supassorn@holyshred.co',
            subject: `🚨 Action Required: ${platformName} Cookie Expired!`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #ff4d4f;">⚠️ HSCaterHub Alert: Scraper Disconnected!</h2>
                    <p>The headless background automation for <strong>${platformName}</strong> just failed significantly during its hourly scheduled run.</p>
                    <p>This usually means the session Cookie/Authentication has explicitly expired, or the merchant portal has explicitly logged out the session.</p>
                    <p><strong>Action required:</strong> Please navigate to your live <a href="https://hscaterhub.web.app/crawlers">Crawler Configurations Dashboard</a>, securely retrieve a new valid cookie string using your browser, and paste it into the <strong>${platformName}</strong> configuration card and hit Update!</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                    <small style="color: #888;">This is an automated safety alert generated natively by the internal node-daemon.</small>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Alert dispatch successfully sent! ID: ${info.messageId}`);
    } catch (e) {
        console.error("❌ Failed to send alert email:", e);
    }
}
