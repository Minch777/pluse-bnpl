import { NextResponse } from 'next/server';

// Возвращает инструкции по отладке проблем с авторизацией
export async function GET() {
  return NextResponse.json({
    title: "Руководство по отладке проблем с авторизацией",
    description: "Эта информация поможет решить проблемы с авторизацией и работой с токенами в приложении.",
    debugSteps: [
      {
        id: 1,
        title: "Проверьте наличие и формат токена",
        description: "Токен должен быть в localStorage и иметь формат 'Bearer JWT-TOKEN'",
        steps: [
          "Откройте страницу /test-token",
          "Проверьте, отображается ли токен в анализе",
          "Проверьте, что формат токена включает префикс 'Bearer'"
        ]
      },
      {
        id: 2,
        title: "Протестируйте вход и сохранение токена",
        description: "Проверьте процесс входа и сохранения токена",
        steps: [
          "Откройте страницу /test-login",
          "Выполните тестовый вход",
          "Проверьте, что токен сохраняется в localStorage"
        ]
      },
      {
        id: 3,
        title: "Проверьте токен непосредственно с API",
        description: "Проверьте, принимает ли API ваш токен",
        steps: [
          "На странице /test-token нажмите 'Тест API-вызова'",
          "Проверьте ответ сервера и возможные ошибки"
        ]
      },
      {
        id: 4,
        title: "Общие проблемы и их решения",
        items: [
          {
            problem: "Authorization header is required",
            solution: "Токен отсутствует или не добавляется в заголовки. Проверьте формат токена в localStorage."
          },
          {
            problem: "Invalid token format",
            solution: "Токен должен быть в формате JWT (xxxx.yyyy.zzzz) с префиксом Bearer."
          },
          {
            problem: "Token expired",
            solution: "Токен истек. Выполните повторный вход."
          }
        ]
      }
    ],
    utilities: [
      {
        name: "Тестирование токена",
        url: "/test-token",
        description: "Инструмент для проверки и тестирования токена"
      },
      {
        name: "Тестирование логина",
        url: "/test-login",
        description: "Инструмент для тестирования процесса входа"
      },
      {
        name: "Страница ссылок",
        url: "/merchant/link",
        description: "Целевая страница, требующая авторизации"
      }
    ]
  });
} 