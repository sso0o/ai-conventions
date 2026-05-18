"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadTemplates = downloadTemplates;
const axios_1 = __importDefault(require("axios"));
const tar = __importStar(require("tar"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const ora_1 = __importDefault(require("ora"));
const TARBALL_URL = 'https://github.com/sso0o/ai-conventions/archive/refs/heads/master.tar.gz';
async function downloadTemplates() {
    const spinner = (0, ora_1.default)('템플릿 다운로드 중...').start();
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-conventions-'));
    const tarballPath = path.join(tmpDir, 'templates.tar.gz');
    const extractDir = path.join(tmpDir, 'extracted');
    try {
        const response = await axios_1.default.get(TARBALL_URL, {
            responseType: 'stream',
            timeout: 30000,
        });
        await new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(tarballPath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        spinner.text = '압축 해제 중...';
        fs.mkdirSync(extractDir, { recursive: true });
        await tar.extract({
            file: tarballPath,
            cwd: extractDir,
            strip: 1,
        });
        fs.unlinkSync(tarballPath);
        spinner.succeed('템플릿 다운로드 완료');
        return extractDir;
    }
    catch (error) {
        spinner.fail('템플릿 다운로드 실패');
        throw error;
    }
}
