import inquirer from 'inquirer';

export interface Answers {
  frontend: 'react-typescript' | 'none';
  frontendRouting: 'react-router' | 'app-router';
  backend: 'spring-boot' | 'nestjs' | 'none';
  serviceImplStyle: 'impl' | 'no-impl';
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
      name: 'serviceImplStyle',
      message: 'Service 계층 구현 방식을 선택하세요:',
      choices: [
        { name: 'impl 사용 (UserService 인터페이스 + UserServiceImpl)', value: 'impl' },
        { name: 'impl 사용 안 함 (UserService 클래스 하나)', value: 'no-impl' },
      ],
      when: (answers) => answers.backend === 'spring-boot',
    },
  ]);

  return {
    ...raw,
    frontendRouting: (raw.frontendRouting as string | undefined) ?? 'react-router',
    serviceImplStyle: (raw.serviceImplStyle as string | undefined) ?? 'no-impl',
  } as Answers;
}
