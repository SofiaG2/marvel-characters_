import {Controller, Get, Post, Put, Patch, Body, Param, Delete, ParseIntPipe} from '@nestjs/common';
import {TeamsService} from './teams.service';
import {CreateTeamDto} from './dto/create-team.dto';
import {UpdateTeamDto} from './dto/update-team.dto';
import {AssignCharactersDto} from './dto/assign-characters.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }
  @Get(':id/characters')
  findCharacters(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findCharacters(id);
  }
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }
  @Patch(':id/characters')
  assignCharacters(@Param('id', ParseIntPipe) id: number, @Body() assignCharactersDto: AssignCharactersDto) {
    return this.teamsService.assignCharacters(id, assignCharactersDto);
  }
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }
}
