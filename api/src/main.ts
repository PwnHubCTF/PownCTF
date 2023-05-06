require('dotenv').config({ path: '../.env' })
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as Sentry from "@sentry/node";

async function bootstrap() {


  Sentry.init({
    dsn: "https://52ced69330094bb8981aa6d6e55f2ac1@o4505136322379776.ingest.sentry.io/4505136325853184",

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    // tracesSampleRate: 1.0,
    // integrations: [...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()],
  });

  const app = await NestFactory.create(AppModule);

  if (process.env.PRODUCTION !== 'true') {
    const config = new DocumentBuilder()
      .setTitle('PwnhubCTF')
      .setDescription('The PwnhubCTF API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3001);
}
bootstrap();
