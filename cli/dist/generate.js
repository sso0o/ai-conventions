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
exports.generateFiles = generateFiles;
const fse = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const chalk_1 = __importDefault(require("chalk"));
async function generateFiles(answers, templateDir, outputDir) {
    const docsDir = path.join(outputDir, 'docs');
    const copiedFiles = [];
    fse.ensureDirSync(docsDir);
    copyCommon(templateDir, docsDir, copiedFiles);
    if (answers.frontend !== 'none') {
        copyFrontend(answers, templateDir, docsDir, copiedFiles);
    }
    if (answers.backend !== 'none') {
        copyBackend(answers, templateDir, docsDir, copiedFiles);
    }
    const conventionContent = buildConventionContent(copiedFiles);
    fse.writeFileSync(path.join(outputDir, 'CLAUDE.md'), conventionContent, 'utf-8');
    fse.writeFileSync(path.join(outputDir, 'AGENTS.md'), conventionContent, 'utf-8');
    console.log(chalk_1.default.green('\n생성된 파일:'));
    copiedFiles.forEach((f) => console.log(chalk_1.default.gray(`  - ${f}`)));
    console.log(chalk_1.default.gray('  - CLAUDE.md'));
    console.log(chalk_1.default.gray('  - AGENTS.md'));
}
function copyCommon(templateDir, docsDir, copiedFiles) {
    const src = path.join(templateDir, 'templates', 'common');
    if (!fse.pathExistsSync(src))
        return;
    for (const file of fse.readdirSync(src)) {
        const srcPath = path.join(src, file);
        if (fse.statSync(srcPath).isFile()) {
            fse.copySync(srcPath, path.join(docsDir, file));
            copiedFiles.push(`docs/${file}`);
        }
    }
}
function copyFrontend(answers, templateDir, docsDir, copiedFiles) {
    const frontendSrc = path.join(templateDir, 'templates', 'frontend');
    const dst = path.join(docsDir, 'frontend');
    fse.ensureDirSync(dst);
    // Common frontend .md files directly under templates/frontend/
    for (const file of fse.readdirSync(frontendSrc)) {
        const srcPath = path.join(frontendSrc, file);
        if (fse.statSync(srcPath).isFile() && file.endsWith('.md')) {
            fse.copySync(srcPath, path.join(dst, file));
            copiedFiles.push(`docs/frontend/${file}`);
        }
    }
    // Routing file based on selected routing strategy
    const routingPath = path.join(frontendSrc, answers.frontendRouting, 'routing.md');
    if (fse.pathExistsSync(routingPath)) {
        fse.copySync(routingPath, path.join(dst, 'routing.md'));
        copiedFiles.push('docs/frontend/routing.md');
    }
}
function copyBackend(answers, templateDir, docsDir, copiedFiles) {
    const stackSrc = path.join(templateDir, 'templates', 'backend', answers.backend);
    const dst = path.join(docsDir, 'backend');
    fse.ensureDirSync(dst);
    const archPath = answers.backend === 'spring-boot'
        ? path.join(stackSrc, 'architecture', answers.serviceImplStyle, 'folder-structure.md')
        : path.join(stackSrc, 'architecture', 'no-impl', 'folder-structure.md');
    if (fse.pathExistsSync(archPath)) {
        fse.copySync(archPath, path.join(dst, 'folder-structure.md'));
        copiedFiles.push('docs/backend/folder-structure.md');
    }
    // All .md files directly inside the stack dir (skip architecture/ subdir)
    for (const file of fse.readdirSync(stackSrc)) {
        const srcPath = path.join(stackSrc, file);
        if (fse.statSync(srcPath).isFile() && file.endsWith('.md')) {
            fse.copySync(srcPath, path.join(dst, file));
            copiedFiles.push(`docs/backend/${file}`);
        }
    }
}
function buildConventionContent(files) {
    const commonFiles = files.filter((f) => !f.startsWith('docs/frontend/') && !f.startsWith('docs/backend/'));
    const frontendFiles = files.filter((f) => f.startsWith('docs/frontend/'));
    const backendFiles = files.filter((f) => f.startsWith('docs/backend/'));
    const lines = ['# Convention Rules', ''];
    if (commonFiles.length > 0) {
        lines.push('## Common');
        commonFiles.forEach((f) => lines.push(`- @${f}`));
        lines.push('');
    }
    if (frontendFiles.length > 0) {
        lines.push('## Frontend');
        frontendFiles.forEach((f) => lines.push(`- @${f}`));
        lines.push('');
    }
    if (backendFiles.length > 0) {
        lines.push('## Backend');
        backendFiles.forEach((f) => lines.push(`- @${f}`));
        lines.push('');
    }
    return lines.join('\n');
}
