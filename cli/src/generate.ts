import * as fse from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { Answers } from './prompt';

export async function generateFiles(
  answers: Answers,
  templateDir: string,
  outputDir: string
): Promise<void> {
  const docsDir = path.join(outputDir, 'docs');
  const copiedFiles: string[] = [];

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

  console.log(chalk.green('\n생성된 파일:'));
  copiedFiles.forEach((f) => console.log(chalk.gray(`  - ${f}`)));
  console.log(chalk.gray('  - CLAUDE.md'));
  console.log(chalk.gray('  - AGENTS.md'));
}

function copyCommon(templateDir: string, docsDir: string, copiedFiles: string[]): void {
  const src = path.join(templateDir, 'templates', 'common');
  if (!fse.pathExistsSync(src)) return;

  for (const file of fse.readdirSync(src)) {
    const srcPath = path.join(src, file);
    if (fse.statSync(srcPath).isFile()) {
      fse.copySync(srcPath, path.join(docsDir, file));
      copiedFiles.push(`docs/${file}`);
    }
  }
}

function copyFrontend(
  answers: Answers,
  templateDir: string,
  docsDir: string,
  copiedFiles: string[]
): void {
  const stackSrc = path.join(templateDir, 'templates', 'frontend', answers.frontend);
  const dst = path.join(docsDir, 'frontend');
  fse.ensureDirSync(dst);

  const archPath = path.join(stackSrc, 'architecture', answers.frontendArchitecture, 'folder-structure.md');
  const fallbackPath = path.join(stackSrc, 'architecture', 'layered', 'folder-structure.md');
  const resolvedArch = fse.pathExistsSync(archPath) ? archPath : fallbackPath;

  if (fse.pathExistsSync(resolvedArch)) {
    fse.copySync(resolvedArch, path.join(dst, 'folder-structure.md'));
    copiedFiles.push('docs/frontend/folder-structure.md');
  }

  // All .md files directly inside the stack dir (skip architecture/ subdir)
  for (const file of fse.readdirSync(stackSrc)) {
    const srcPath = path.join(stackSrc, file);
    if (fse.statSync(srcPath).isFile() && file.endsWith('.md')) {
      fse.copySync(srcPath, path.join(dst, file));
      copiedFiles.push(`docs/frontend/${file}`);
    }
  }
}

function copyBackend(
  answers: Answers,
  templateDir: string,
  docsDir: string,
  copiedFiles: string[]
): void {
  const stackSrc = path.join(templateDir, 'templates', 'backend', answers.backend);
  const dst = path.join(docsDir, 'backend');
  fse.ensureDirSync(dst);

  const archPath = path.join(stackSrc, 'architecture', answers.backendArchitecture, 'folder-structure.md');
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

function buildConventionContent(files: string[]): string {
  const commonFiles = files.filter(
    (f) => !f.startsWith('docs/frontend/') && !f.startsWith('docs/backend/')
  );
  const frontendFiles = files.filter((f) => f.startsWith('docs/frontend/'));
  const backendFiles = files.filter((f) => f.startsWith('docs/backend/'));

  const lines: string[] = ['# Convention Rules', ''];

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
