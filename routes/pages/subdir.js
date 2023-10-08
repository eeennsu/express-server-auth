import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

router.use(express.static('public'));

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'subdir', 'index.html'));
});

router.get('/test(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'subdir', 'test.html'));
});

export default router;