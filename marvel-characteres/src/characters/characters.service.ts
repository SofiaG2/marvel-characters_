import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOptionsWhere, Repository} from 'typeorm';
import {Character} from './entities/character.entity';
import {Team} from '../teams/entities/team.entity';
import {CreateCharacterDto} from './dto/create-character.dto';
import {UpdateCharacterDto} from './dto/update-character.dto';

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character)
    private readonly charactersRepository: Repository<Character>,
    @InjectRepository(Team)
    private readonly teamsRepository: Repository<Team>,
  ) {}

  async create(createCharacterDto: CreateCharacterDto) {
    const existing = await this.charactersRepository.findOneBy({ alias: createCharacterDto.alias });
    if (existing) {
      throw new ConflictException('Character alias already exists');
    }
    if (createCharacterDto.team_id != null) {
      const team = await this.teamsRepository.findOneBy({ id: createCharacterDto.team_id });
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      if (!team.active) {
        throw new BadRequestException('Team is inactive');
      }
    }
    const character = this.charactersRepository.create({
      real_name: createCharacterDto.real_name,
      alias: createCharacterDto.alias,
      main_power: createCharacterDto.main_power,
      power_level: createCharacterDto.power_level,
      status: createCharacterDto.status ?? 'ACTIVE',
      is_villain: createCharacterDto.is_villain ?? false,
      team_id: createCharacterDto.team_id ?? null,
    });
    return this.charactersRepository.save(character);
  }

  findAll(status?: string, teamId?: string) {
    const where: FindOptionsWhere<Character> = {};
    if (status !== undefined) {
      if (!['ACTIVE', 'INJURED', 'MISSING', 'RETIRED'].includes(status)) {
        throw new BadRequestException('Invalid status');
      }
      where.status = status;
    }
    if (teamId !== undefined) {
      const id = Number(teamId);
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestException('Invalid teamId');
      }
      where.team_id = id;
    }
    return this.charactersRepository.find({
      where,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const character = await this.charactersRepository.findOne({
      where: { id },
      relations: { team: true },
    });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    return character;
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    const character = await this.charactersRepository.findOneBy({ id });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    const existing = await this.charactersRepository.findOneBy({ alias: updateCharacterDto.alias });
    if (existing && existing.id !== id) {
      throw new ConflictException('Character alias already exists');
    }
    if (character.status === 'RETIRED' && updateCharacterDto.status === 'INJURED') {
      throw new BadRequestException('Invalid status change');
    }
    if (updateCharacterDto.team_id != null) {
      const team = await this.teamsRepository.findOneBy({ id: updateCharacterDto.team_id });
      if (!team) {
        throw new NotFoundException('Team not found');
      }
      if (!team.active) {
        throw new BadRequestException('Team is inactive');
      }
    }
    this.charactersRepository.merge(character, {
      real_name: updateCharacterDto.real_name,
      alias: updateCharacterDto.alias,
      main_power: updateCharacterDto.main_power,
      power_level: updateCharacterDto.power_level,
      status: updateCharacterDto.status ?? 'ACTIVE',
      is_villain: updateCharacterDto.is_villain ?? false,
      team_id: updateCharacterDto.team_id ?? null,
    });
    await this.charactersRepository.save(character);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: string) {
    const character = await this.charactersRepository.findOneBy({ id });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    if (character.status === 'RETIRED' && status === 'INJURED') {
      throw new BadRequestException('Invalid status change');
    }
    character.status = status;
    await this.charactersRepository.save(character);
    return this.findOne(id);
  }

  async remove(id: number) {
    const character = await this.charactersRepository.findOneBy({ id });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    await this.charactersRepository.remove(character);
    return { message: 'Character deleted' };
  }
}
