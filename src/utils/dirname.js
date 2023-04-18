import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const subFileName = __filename.substring(0, __filename.length-10)
const __dirname = dirname(subFileName);

export default __dirname;