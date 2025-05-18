import { NextRequest, NextResponse } from 'next/server';

// Эмуляция API логина для тестирования
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Для тестирования мы просто проверяем наличие email и password
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    console.log('Test login called with:', { email, passwordProvided: !!password });
    
    // Для теста всегда возвращаем успешный результат с токеном
    // В реальном приложении здесь была бы проверка учетных данных
    
    // Тестовый токен
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6Im1lcmNoYW50In0.7bHQI2CmTCgQuV3PJeVgGlsafKH5hEtO-3o4NZP5bh0';
    
    // ВАЖНО: Мы теперь возвращаем accessToken вместо token,
    // чтобы протестировать корректность обработки разных форматов ответа
    
    return NextResponse.json({
      success: true,
      accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6Im1lcmNoYW50In0.7bHQI2CmTCgQuV3PJeVgGlsafKH5hEtO-3o4NZP5bh0`,
      role: 'merchant',
      user: {
        id: '123456790',
        email: email,
        role: 'merchant'
      }
    });
    
  } catch (error: any) {
    console.error('Error in test login API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 