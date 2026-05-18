import inquirer from 'inquirer';

export interface Answers {
  frontend: 'react-typescript' | 'none';
  frontendRouting: 'react-router' | 'app-router';
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
        { name: 'React + TypeScript', value: 'react-typescript' },
        { name: '없음', value: 'none' },
      ],
    },
    {
      type: 'list',
      name: 'frontendRouting',
      message: '라우팅 방식을 선택하세요:',
      choices: [
        { name: 'react-router (Vite/SPA)', value: 'react-router' },
        { name: 'App Router (Next.js)', value: 'app-router' },
      ],
      when: (answers) => answers.frontend !== 'none',
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
    frontendRouting: (raw.frontendRouting as string | undefined) ?? 'react-router',
    frontendArchitecture: (raw.frontendArchitecture as string | undefined) ?? 'layered',
    backendArchitecture: (raw.backendArchitecture as string | undefined) ?? 'layered',
  } as Answers;
}
