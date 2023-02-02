import nodemailer from "nodemailer";

const sendEmail = async (options) => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		secure: false,
		logger: true,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
		//If use gmail need to activate "less secure app" option in settings
	});

	const mailOptions = {
		from: "superadmin <superadmin@t05.tech>",
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(mailOptions);
};

export default sendEmail;
