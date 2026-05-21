# NestJS Exception Handling

## 전역 설정

`main.ts`에서 한 번만 등록한다. `ExceptionFilter`를 전역으로 등록하면 모든 컨트롤러에 자동 적용된다.

```ts
// main.ts
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

app.useGlobalFilters(new HttpExceptionFilter());
```

## ValidationException

ValidationPipe 검증 오류에 필드명을 보존하기 위한 예외 클래스다. `BadRequestException`을 상속하므로 ExceptionFilter에서 별도 분기로 처리한다.

```ts
// src/common/exceptions/validation.exception.ts
import { BadRequestException } from '@nestjs/common';

export class ValidationException extends BadRequestException {
  constructor(public readonly errors: { field: string; message: string }[]) {
    super();
  }
}
```

`ValidationPipe`에서 `exceptionFactory`로 생성한다 (→ `validation.md` 참고).

## HttpExceptionFilter

`ValidationException`은 `HttpException`을 상속하므로 반드시 먼저 분기한다.

```ts
// src/common/filters/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions/validation.exception';

const DEFAULT_MESSAGES: Record<number, string> = {
  400: '잘못된 요청입니다',
  401: '인증이 필요합니다',
  403: '접근 권한이 없습니다',
  404: '리소스를 찾을 수 없습니다',
  409: '요청이 충돌합니다',
  500: '서버 오류가 발생했습니다',
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // ValidationPipe 에러 — data.errors 형식으로 반환
    if (exception instanceof ValidationException) {
      return response.status(400).json({
        success: false,
        data: { errors: exception.errors },
        message: '잘못된 요청입니다',
      });
    }

    // HttpException — throw 시 메시지 우선, 없으면 기본값
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'string'
          ? res
          : typeof (res as Record<string, unknown>).message === 'string'
            ? (res as Record<string, unknown>).message
            : DEFAULT_MESSAGES[status] ?? '오류가 발생했습니다';

      if (status >= 500) {
        this.logger.error(`[${status}] ${message}`, (exception as Error).stack);
      }

      return response.status(status).json({ success: false, data: null, message });
    }

    // Non-HttpException — 500 변환, 원본 에러 로깅
    this.logger.error(
      'Unexpected error',
      exception instanceof Error ? exception.stack : String(exception),
    );
    return response.status(500).json({
      success: false,
      data: null,
      message: '서버 오류가 발생했습니다',
    });
  }
}
```

## 예외 사용 규칙

| 상황 | 예외 | 상태코드 |
|------|------|---------|
| 리소스 없음 | `NotFoundException` | 404 |
| 중복/충돌 | `ConflictException` | 409 |
| 권한 없음 | `ForbiddenException` | 403 |
| 인증 없음 | `UnauthorizedException` | 401 |
| 비즈니스 규칙 위반 | `BadRequestException` | 400 |
| 예상치 못한 에러 | throw 없이 전파 | 500 (Filter 처리) |

- 메시지는 한국어로 작성한다
- throw 시 메시지를 명시하면 응답 `message`에 사용, 생략하면 기본값 사용
- 예상치 못한 에러는 `catch` 없이 그냥 전파한다 — `HttpExceptionFilter`가 500으로 변환한다

```ts
// ✅
throw new NotFoundException('사용자를 찾을 수 없습니다');
throw new ConflictException('이미 사용 중인 이메일입니다');
throw new ForbiddenException(); // 메시지 생략 → 기본값 "접근 권한이 없습니다" 사용

// ❌ 영어 메시지
throw new NotFoundException('User not found');

// ❌ 예상치 못한 에러를 catch로 래핑 — 스택 트레이스 유실
try {
  await this.db.query(sql);
} catch (e) {
  throw new InternalServerErrorException('DB 오류');
}
```
