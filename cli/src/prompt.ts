import inquirer from 'inquirer';

export interface Answers {
  frontend: 'vite' | 'nextjs' | 'none';
  frontendArchitecture: 'layered' | 'feature-slice';
  backend: 'spring-boot' | 'nestjs' | 'none';
  backendArchitecture: 'layered' | 'clean';
}

export async function prompt(): Promise<Answers> {
  const raw = await inquirer.prompt([
    {
      type: 'list',
      name: 'frontend',
      message: '프론트엔드 스택을 선택하세요:',
      choices: [
        { name: 'Vite', value: 'vite' },
        { name: 'Next.js', value: 'nextjs' },
        { name: '없음', value: 'none' },
      ],
    },
    {
      type: 'list',
      name: 'frontendArchitecture',
      message: '프론트엔드 아키텍처를 선택하세요:',
      choices: [
        { name: 'Layered Architecture', value: 'layered' },
        { name: 'Feature-Slice Design', value: 'feature-slice' },
      ],
      when: (answers) => answers.frontend !== 'none',
    },
    {
      type: 'list',
      name: 'backend',
      message: '백엔드 스택을 선택하세요:',
      choices: [
        { name: 'Spring Boot', value: 'spring-boot' },
        { name: 'NestJS', value: 'nestjs' },
        { name: '없음', value: 'none' },
      ],
    },
    {
      type: 'list',
      name: 'backendArchitecture',
      message: '백엔드 아키텍처를 선택하세요:',
      choices: [
        { name: 'Layered Architecture', value: 'layered' },
        { name: 'Clean Architecture', value: 'clean' },
      ],
      when: (answers) => answers.backend !== 'none',
    },
  ]);

  return {
    ...raw,
    frontendArchitecture: (raw.frontendArchitecture as string | undefined) ?? 'layered',
    backendArchitecture: (raw.backendArchitecture as string | undefined) ?? 'layered',
  } as Answers;
}
