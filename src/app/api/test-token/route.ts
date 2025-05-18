import { NextRequest, NextResponse } from 'next/server';

// Эндпоинт для проверки статуса токена
export async function GET(request: NextRequest) {
  console.log('Test token API called');
  
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authorization header is missing' },
      { status: 401 }
    );
  }
  
  // Вывести информацию о заголовке авторизации
  console.log('Auth header:', authHeader);
  
  // Проверка формата Bearer token
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : authHeader;
  
  try {
    // Для демонстрации просто декодируем JWT (без проверки подписи)
    // В реальной ситуации токен нужно полностью проверять
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    return NextResponse.json({
      authenticated: true,
      tokenInfo: {
        valid: true,
        payload: decodedPayload
      }
    });
  } catch (error) {
    console.error('Error processing token:', error);
    return NextResponse.json(
      { error: 'Invalid token format' },
      { status: 401 }
    );
  }
} 