import path from 'path';
import { fileURLToPath } from 'url';

export const checkDirname = (url) => {
    const __filename = fileURLToPath(url);
    const __dirname = path.dirname(__filename);
    return __dirname;
};
