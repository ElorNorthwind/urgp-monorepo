import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UsePipes,
} from '@nestjs/common';
import { DatabaseService } from './database.service';
import { CaseReply, DbStreet, DbUser } from './models/types';
import {
  getUsersByDepartment,
  GetUsersByDepartmentDto,
} from './models/dto/get-users-by-department';
import { GetUserByIdtDto, getUserById } from './models/dto/get-user-by-id';
import { GetCasesDto, getCases } from './models/dto/get-cases';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { GetStreetsDto, getStreets } from './models/dto/get-streets';
import {
  ExternalCredentials,
  ExternalLookup,
  externalLookup,
} from '@urgp/server/entities';

@Controller('db')
export class DatabaseController {
  constructor(private readonly dbServise: DatabaseService) {}

  @Get('/credentials')
  // @UsePipes(new ZodValidationPipe(findSessionDto))
  getDbCredentials(@Query() dto: ExternalLookup): Promise<ExternalCredentials> {
    return this.dbServise.db.users.credentials(externalLookup.parse(dto));
  }

  @Get('/streets')
  @UsePipes(new ZodValidationPipe(getStreets))
  getDbStreets(@Query() getStreetsDto: GetStreetsDto): Promise<DbStreet[]> {
    const { query, limit } = getStreetsDto;
    if (!query) return this.dbServise.db.streets.all();
    return this.dbServise.db.streets.byQuery({ query, limit });
  }

  @Get('/users')
  @UsePipes(new ZodValidationPipe(getUsersByDepartment))
  getDbUsers(
    @Query() getUsersByDepartmentDto: GetUsersByDepartmentDto,
  ): Promise<DbUser[]> {
    const { uprId } = getUsersByDepartmentDto;
    if (!uprId) return this.dbServise.db.users.all();
    return this.dbServise.db.users.byDepartment(uprId);
  }

  @Get('/user')
  @UsePipes(new ZodValidationPipe(getUserById))
  getDbUser(@Query() getUserByIdDto: GetUserByIdtDto): Promise<DbUser> {
    const { id, edoId } = getUserByIdDto;
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!id) return this.dbServise.db.users.byId(id);
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!edoId) return this.dbServise.db.users.byEdoId(edoId);
    throw new HttpException('No id provided!', HttpStatus.BAD_REQUEST);
  }

  @Get('/questions')
  async getDbQuestions() {
    return this.dbServise.db.questions.all();
  }

  @Get('/cases')
  @UsePipes(new ZodValidationPipe(getCases)) // todo: добавить поиск \ фильтрацию в ДТО
  async getDbOperations(
    @Query() getCasesDto: GetCasesDto, // @Query() getUsersByDepartmentDto: GetUsersByDepartmentDto,
  ): Promise<CaseReply> {
    const records = await this.dbServise.db.cases.many(getCasesDto);

    // Не уверен, что это в принципе надо высчитывать на бэкэнде...
    if (records.length > 0) {
      const {
        priority: lastPrio,
        zamDueDate: lastDate,
        id: lastId,
        // eslint-disable-next-line no-unsafe-optional-chaining
      } = records.slice(-1)?.[0];

      return {
        records, //: records.map((r) => `${r.priority} | ${r.id} | ${r.zamDueDate}`) as unknown as DbCase[], // так то просто records
        count: records.length,
        hasMore: records.length === getCasesDto?.limit,
        lastPrio: lastPrio || undefined,
        lastDate: lastDate || undefined,
        lastId: lastId || undefined,
      };
    }

    return { records: [], count: 0, hasMore: false };
  }
}
