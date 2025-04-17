import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ImageModule } from './image/image.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { CategorysModule } from './categorys/categorys.module';
import { ImageVersionModule } from './image-version/image-version.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ImageModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService)  =>  ({
        store: redisStore,
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
        ttl: config.get<number>('REDIS_TTL', 1800)
      }),
    }),
    UsersModule,
    TagsModule,
    CategorysModule,
    ImageVersionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
