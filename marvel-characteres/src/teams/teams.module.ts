import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TeamsService} from './teams.service';
import {TeamsController} from './teams.controller';
import {Team} from './entities/team.entity';
import {Character} from '../characters/entities/character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Character])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
