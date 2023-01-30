import serveStatic from "serve-static";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Serve API documentations
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docDir = path.join(__dirname, "../documentation");
const serveDoc = (app) => {
	// Ignore if is production or directory does not exist
	if (
		!["development", "staging"].includes(process.env.NODE_ENV) ||
		!fs.existsSync(docDir)
	) {
		return;
	}

	app.use("/api", serveStatic(docDir, { maxAge: "1d" }));
};

export default (app) => serveDoc(app);
