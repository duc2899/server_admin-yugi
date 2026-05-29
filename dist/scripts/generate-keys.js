"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/generate-keys.ts
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const envs = ['dev', 'prod'];
(0, fs_1.mkdirSync)('keys', { recursive: true });
for (const env of envs) {
    const { privateKey, publicKey } = (0, crypto_1.generateKeyPairSync)('ec', {
        namedCurve: 'P-256',
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    // Lưu file .pem
    (0, fs_1.writeFileSync)(`keys/private.${env}.pem`, privateKey);
    (0, fs_1.writeFileSync)(`keys/public.${env}.pem`, publicKey);
    // Xác định file .env tương ứng
    const envFile = env === 'dev' ? '.env.development' : '.env.production';
    // Đọc nội dung cũ nếu có, tránh xóa các biến khác
    let existing = (0, fs_1.existsSync)(envFile) ? (0, fs_1.readFileSync)(envFile, 'utf8') : '';
    // Replace hoặc append PRIVATE_KEY và PUBLIC_KEY
    const privateLine = `PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"`;
    const publicLine = `PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"`;
    existing = setEnvVar(existing, 'PRIVATE_KEY', privateLine);
    existing = setEnvVar(existing, 'PUBLIC_KEY', publicLine);
    (0, fs_1.writeFileSync)(envFile, existing.trimStart());
    console.log(`✅ ${env} keys generated → ${envFile}`);
}
function setEnvVar(content, key, newLine) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(content)) {
        return content.replace(regex, newLine);
    }
    return content + '\n' + newLine + '\n';
}
