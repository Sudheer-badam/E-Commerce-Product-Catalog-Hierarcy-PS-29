import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend apps
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`Backend API is running on port ${port}`);
}
bootstrap();
