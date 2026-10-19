import {Test} from '@nestjs/testing';
import {jest} from '@jest/globals';
import {TeamsController} from './teams.controller';
import {TeamsService} from './teams.service';

describe('TeamsController', () => {
  let controller: TeamsController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findCharacters: jest.fn(),
    update: jest.fn(),
    assignCharacters: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [{ provide: TeamsService, useValue: service }],
    }).compile();
    controller = module.get<TeamsController>(TeamsController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should list teams', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });
  it('should find a team', () => {
    controller.findOne(3);
    expect(service.findOne).toHaveBeenCalledWith(3);
  });
  it('should list team characters', () => {
    controller.findCharacters(3);
    expect(service.findCharacters).toHaveBeenCalledWith(3);
  });
  it('should assign characters to a team', () => {
    controller.assignCharacters(3, { characterIds: [1, 2] });
    expect(service.assignCharacters).toHaveBeenCalledWith(3, { characterIds: [1, 2] });
  });
});
