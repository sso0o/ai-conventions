import axios from 'axios';
import * as tar from 'tar';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import ora from 'ora';

const TARBALL_URL =
  'https://github.com/sso0o/ai-conventions/archive/refs/heads/master.tar.gz';

export async function downloadTemplates(): Promise<string> {
  const spinner = ora('템플릿 다운로드 중...').start();

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-conventions-'));
  const tarballPath = path.join(tmpDir, 'templates.tar.gz');
  const extractDir = path.join(tmpDir, 'extracted');

  try {
    const response = await axios.get<NodeJS.ReadableStream>(TARBALL_URL, {
      responseType: 'stream',
      timeout: 30000,
    });

    await new Promise<void>((resolve, reject) => {
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
  } catch (error) {
    spinner.fail('템플릿 다운로드 실패');
    throw error;
  }
}
