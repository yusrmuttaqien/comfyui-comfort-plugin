// Vite 5 lib mode always names the CSS output style.css; ComfyUI loads any
// .css in web/, but we want a predictable name.
import { renameSync, existsSync } from "node:fs";

const from = "web/style.css";
const to = "web/comfort.css";
if (existsSync(from)) renameSync(from, to);
