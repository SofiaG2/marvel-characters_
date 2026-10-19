import {Test} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {BadRequestException, ConflictException, NotFoundException} from '@nestjs/common';
import {jest} from '@jest/globals';
import {CharactersService} from './characters.service';
import {Character} from './entities/character.entity';
import {Team} from '../teams/entities/team.entity';

describe('CharactersService', () => {
  let service: CharactersService;
  const charactersRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };
  const teamsRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        CharactersService,
        { provide: getRepositoryToken(Character), useValue: charactersRepository },
        { provide: getRepositoryToken(Team), useValue: teamsRepository },
      ],
    }).compile();
    service = module.get<CharactersService>(CharactersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list characters', async () => {
    const characters = [{ id: 1, alias: 'Thor' }];
    charactersRepository.find.mockImplementation(async () => characters);
    expect(await service.findAll()).toEqual(characters);
  });

  it('should reject invalid status', () => {
    expect(() => service.findAll('INVALID')).toThrow(BadRequestException);
  });

  it('should return 404 for missing character', async () => {
    charactersRepository.findOne.mockImplementation(async () => null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should reject duplicate alias', async () => {
    charactersRepository.findOneBy.mockImplementation(async () => ({ id: 1, alias: 'Thor' }));
    const data = {
      real_name: 'Another Thor',
      alias: 'Thor',
      main_power: 'Thunder',
      power_level: 90,
    };
    await expect(service.create(data)).rejects.toThrow(ConflictException);
  });

  it('should reject RETIRED to INJURED', async () => {
    charactersRepository.findOneBy.mockImplementation(async () => ({ id: 1, status: 'RETIRED' }));
    await expect(service.updateStatus(1, 'INJURED')).rejects.toThrow(BadRequestException);
  });

  it('should return 404 when deleting missing character', async () => {
    charactersRepository.findOneBy.mockImplementation(async () => null);
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
