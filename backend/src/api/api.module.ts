import { Module } from "@nestjs/common";
import { SessionModule } from "./session/session.module";
import { RouterModule } from "@nestjs/core";


const submodules = [
  SessionModule,
  RouterModule.register([
    {
      path: "api",
      module: SessionModule
    }
  ])
];

@Module({
  imports: [...submodules],
  exports: [...submodules],
  controllers: []
})
export class ApiModule {
}
