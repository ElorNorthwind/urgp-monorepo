import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { DmService } from './dm.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  DmDateRangeQuery,
  dmDateRangeQuerySchema,
} from '@urgp/shared/entities';

@Controller('dm')
export class DmController {
  constructor(private readonly dm: DmService) {}

  @UsePipes(new ZodValidationPipe(dmDateRangeQuerySchema))
  @Get('test')
  Test(@Query() dateRange: DmDateRangeQuery): Promise<number> {
    return this.dm.addDmLongTermRecords(dateRange);
  }

  @Get('update-active')
  UpdateActiveResolutions(): Promise<number> {
    return this.dm.updateActiveResolutions();
  }

  @Get('all-undone')
  GetAllUndoneResolutions(): Promise<number> {
    return this.dm.addDmAllUndoneResolutions();
  }
}

// @Get('/users')
// @UsePipes(new ZodValidationPipe(getUsersByDepartment))
// getDbUsers(
//   @Query() getUsersByDepartmentDto: GetUsersByDepartmentDto,
// ): Promise<DbUser[]> {
//   const { uprId } = getUsersByDepartmentDto;
//   if (!uprId) return this.dbServise.db.users.all();
//   return this.dbServise.db.users.byDepartment(uprId);
// }
