import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ApiModule } from "./api/api.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "static"),
      serveRoot: "/"
    }),
    ApiModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
