import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const app = express();
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST"],
}));
app.use(express.json());

app.post("/send", async (req, res) => {
  const {
    name,
    email,
    contact,
    requirements,
    description,
  } = req.body;

  console.log({
    emailUser: process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASS,
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `🚀 New Project Inquiry from ${name}`,
    html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Inquiry</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f7fb;
  font-family:Inter,Segoe UI,Arial,sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table width="700" cellpadding="0" cellspacing="0" style="
  max-width:700px;
  background:#ffffff;
  border-radius:20px;
  overflow:hidden;
  box-shadow:0 10px 40px rgba(0,0,0,0.08);
">

  <!-- Header -->
  <tr>
    <td style="
      background:linear-gradient(135deg,#2563eb,#3b82f6,#60a5fa);
      padding:40px;
      text-align:center;
      color:white;
    ">
      <h1 style="
        margin:0;
        font-size:30px;
        font-weight:700;
      ">
        New Project Inquiry
      </h1>

      <p style="
        margin-top:12px;
        font-size:15px;
        opacity:.95;
      ">
        A new client has submitted the contact form.
      </p>
    </td>
  </tr>

  <!-- Content -->
  <tr>
    <td style="padding:40px;">

      <div style="
        background:#f8fafc;
        border:1px solid #e5e7eb;
        border-radius:16px;
        padding:24px;
      ">

        <table width="100%" cellpadding="0" cellspacing="0">

          <tr>
            <td style="padding-bottom:16px;">
              <strong style="color:#2563eb;">👤 Name</strong>
              <p style="margin:6px 0 0;color:#111827;">
                ${name}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:16px;">
              <strong style="color:#2563eb;">📧 Email</strong>
              <p style="margin:6px 0 0;color:#111827;">
                ${email}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:16px;">
              <strong style="color:#2563eb;">📱 Contact</strong>
              <p style="margin:6px 0 0;color:#111827;">
                ${contact || "Not provided"}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:16px;">
              <strong style="color:#2563eb;">🛠 Requirements</strong>
              <p style="margin:6px 0 0;color:#111827;">
                ${requirements}
              </p>
            </td>
          </tr>

          <tr>
            <td>
              <strong style="color:#2563eb;">📝 Project Description</strong>

              <div style="
                margin-top:10px;
                background:white;
                border-left:4px solid #2563eb;
                padding:16px;
                border-radius:10px;
                color:#374151;
                line-height:1.7;
              ">
                ${description.replace(/\n/g, "<br>")}
              </div>
            </td>
          </tr>

        </table>

      </div>

      <!-- Divider -->
      <div style="
        margin:32px 0;
        height:1px;
        background:#e5e7eb;
      "></div>

      <!-- Meta -->
      <table width="100%">
        <tr>
          <td style="
            color:#6b7280;
            font-size:13px;
          ">
            Submitted on:
            <strong>${new Date().toLocaleString()}</strong>
          </td>

          <td align="right" style="
            color:#6b7280;
            font-size:13px;
          ">
            WeblureX Contact Form
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="
      background:#0f172a;
      color:#cbd5e1;
      text-align:center;
      padding:24px;
      font-size:13px;
    ">
      © ${new Date().getFullYear()} WeblureX • New Lead Notification
    </td>
  </tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
  };

  try {
    await transporter.verify();
    console.log("SMTP READY");

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Email sent successfully.",
    });
  } catch (err) {
    console.error("Error sending email:", err);

    res.status(500).json({
      message: "Email sending failed.",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
