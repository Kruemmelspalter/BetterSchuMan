import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ApiModule } from './api/api.module';
import { RouterModule } from "@nestjs/core";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "static"),
      serveRoot: "/",
    }),
    ApiModule,
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
      },
    ])
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
