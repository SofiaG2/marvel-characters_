import {Controller, Get, Post, Put, Patch, Body, Param, Delete, Query, ParseIntPipe} from '@nestjs/common';
import {CharactersService} from './characters.service';
import {CreateCharacterDto} from './dto/create-character.dto';
import {UpdateCharacterDto} from './dto/update-character.dto';
import {UpdateStatusDto} from './dto/update-status.dto';

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post()
  create(@Body() createCharacterDto: CreateCharacterDto) {
    return this.charactersService.create(createCharacterDto);
  }
  @Get()
  findAll(@Query('status') status?: string, @Query('teamId') teamId?: string) {
    return this.charactersService.findAll(status, teamId);
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.findOne(id);
  }
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCharacterDto: UpdateCharacterDto) {
    return this.charactersService.update(id, updateCharacterDto);
  }
  @Patch(':id/status')
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto) {
    return this.charactersService.updateStatus(id, updateStatusDto.status);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.charactersService.remove(id);
  }
}
