import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {Team} from './entities/team.entity';
import {Character} from '../characters/entities/character.entity';
import {CreateTeamDto} from './dto/create-team.dto';
import {UpdateTeamDto} from './dto/update-team.dto';
import {AssignCharactersDto} from './dto/assign-characters.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const existing = await this.teamsRepository.findOneBy({ name: createTeamDto.name });
    if (existing) {
      throw new ConflictException('Team name already exists');
    }
    const active = createTeamDto.active ?? true;
    if (createTeamDto.characterIds?.length) {
      await this.validateCharacterIds(createTeamDto.characterIds);
      if (!active) {
        throw new BadRequestException('Team is inactive');
      }
    }
    const team = this.teamsRepository.create({
      name: createTeamDto.name,
      base: createTeamDto.base ?? null,
      founded_year: createTeamDto.founded_year ?? null,
      active,
    });
    await this.teamsRepository.save(team);
    if (createTeamDto.characterIds?.length) {
      await this.charactersRepository.update({ id: In(createTeamDto.characterIds) }, { team_id: team.id });
    }
    return this.findOne(team.id);
  }

  findAll() {
    return this.teamsRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const team = await this.teamsRepository.findOneBy({ id });
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async findCharacters(id: number) {
    await this.findOne(id);
    return this.charactersRepository.find({ where: { team_id: id }, order: { id: 'ASC' } });
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const team = await this.findOne(id);
    const existing = await this.teamsRepository.findOneBy({ name: updateTeamDto.name });
    if (existing && existing.id !== id) {
      throw new ConflictException('Team name already exists');
    }
    this.teamsRepository.merge(team, {
      name: updateTeamDto.name,
      base: updateTeamDto.base ?? null,
      founded_year: updateTeamDto.founded_year ?? null,
      active: updateTeamDto.active ?? true,
    });
    return this.teamsRepository.save(team);
  }

  async assignCharacters(id: number, assignCharactersDto: AssignCharactersDto) {
    const team = await this.findOne(id);
    await this.validateCharacterIds(assignCharactersDto.characterIds);
    if (!team.active) {
      throw new BadRequestException('Team is inactive');
    }
    await this.charactersRepository.update({ id: In(assignCharactersDto.characterIds) }, { team_id: id });
    return this.findCharacters(id);
  }

  async remove(id: number) {
    const team = await this.findOne(id);
    const charactersCount = await this.charactersRepository.count({ where: { team_id: id } });
    if (charactersCount > 0) {
      throw new ConflictException('Team has characters assigned');
    }
    await this.teamsRepository.remove(team);
    return { message: 'Team deleted' };
  }

  private async validateCharacterIds(characterIds: number[]) {
    const characters = await this.charactersRepository.findBy({ id: In(characterIds) });
    if (characters.length !== new Set(characterIds).size) {
      throw new NotFoundException('Character not found');
    }
  }
}
