import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as morgan from "morgan";
import { join } from "path";

async function bootstrap() {
  console.log(join(__dirname, "static"))
  const app = await NestFactory.create(AppModule);

  app.use(morgan(':status :method :url :res[content-length] - :response-time ms'));

  await app.listen(process.env.PORT || 80);
}

bootstrap();
