import helmet from "helmet";

// HelmetJS
const initHelmet = (app) => {
	app.use(
		helmet({
			// Configurable headers
			// contentSecurityPolicy: false,
			// referrerPolicy: { policy: "no-referrer" },
			// hsts: { maxAge: 31536000 },
		})
	);
	app.use(helmet.hidePoweredBy());
};

export { initHelmet };
