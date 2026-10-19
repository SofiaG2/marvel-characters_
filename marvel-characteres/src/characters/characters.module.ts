import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CharactersService} from './characters.service';
import {CharactersController} from './characters.controller';
import {Character} from './entities/character.entity';
import {Team} from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Team])],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
