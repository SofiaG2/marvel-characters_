import {Test} from '@nestjs/testing';
import {jest} from '@jest/globals';
import {CharactersController} from './characters.controller';
import {CharactersService} from './characters.service';

describe('CharactersController', () => {
  let controller: CharactersController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [{ provide: CharactersService, useValue: service }],
    }).compile();
    controller = module.get<CharactersController>(CharactersController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should list characters', () => {
    controller.findAll('ACTIVE', '1');
    expect(service.findAll).toHaveBeenCalledWith('ACTIVE', '1');
  });
  it('should find a character', () => {
    controller.findOne(3);
    expect(service.findOne).toHaveBeenCalledWith(3);
  });
  it('should update character status', () => {
    controller.updateStatus(3, { status: 'RETIRED' });
    expect(service.updateStatus).toHaveBeenCalledWith(3, 'RETIRED');
  });
});
