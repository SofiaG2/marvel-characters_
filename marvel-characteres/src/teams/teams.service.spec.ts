import {Test} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {BadRequestException, ConflictException, NotFoundException} from '@nestjs/common';
import {jest} from '@jest/globals';
import {TeamsService} from './teams.service';
import {Team} from './entities/team.entity';
import {Character} from '../characters/entities/character.entity';

describe('TeamsService', () => {
  let service: TeamsService;
  const teamsRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    merge: jest.fn(),
  };
  const charactersRepository = {
    find: jest.fn(),
    findBy: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: getRepositoryToken(Team), useValue: teamsRepository },
        { provide: getRepositoryToken(Character), useValue: charactersRepository },
      ],
    }).compile();
    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list teams', async () => {
    const teams = [{ id: 1, name: 'Avengers' }];
    teamsRepository.find.mockImplementation(async () => teams);
    expect(await service.findAll()).toEqual(teams);
  });

  it('should return 404 for missing team', async () => {
    teamsRepository.findOneBy.mockImplementation(async () => null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should reject duplicate name', async () => {
    teamsRepository.findOneBy.mockImplementation(async () => ({ id: 1, name: 'Avengers' }));
    await expect(service.create({ name: 'Avengers' })).rejects.toThrow(ConflictException);
  });

  it('should reject assigning characters to an inactive team', async () => {
    teamsRepository.findOneBy.mockImplementation(async () => ({ id: 1, name: 'Thunderbolts', active: false }));
    charactersRepository.findBy.mockImplementation(async () => [{ id: 1 }]);
    await expect(service.assignCharacters(1, { characterIds: [1] })).rejects.toThrow(BadRequestException);
  });

  it('should reject assigning characters that do not exist', async () => {
    teamsRepository.findOneBy.mockImplementation(async () => ({ id: 1, name: 'Avengers', active: true }));
    charactersRepository.findBy.mockImplementation(async () => []);
    await expect(service.assignCharacters(1, { characterIds: [999] })).rejects.toThrow(NotFoundException);
  });

  it('should reject deleting a team with characters', async () => {
    teamsRepository.findOneBy.mockImplementation(async () => ({ id: 1, name: 'Avengers' }));
    charactersRepository.count.mockImplementation(async () => 2);
    await expect(service.remove(1)).rejects.toThrow(ConflictException);
  });

  it('should return 404 when deleting a missing team', async () => {
    teamsRepository.findOneBy.mockImplementation(async () => null);
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });
});
