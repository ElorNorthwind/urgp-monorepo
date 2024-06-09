import { Injectable } from '@nestjs/common';
import { HouseSerachQuery } from '../model/types';
import { RsmSearchService } from './search.service';

@Injectable()
export class RsmBtriService {
  constructor(private readonly search: RsmSearchService) {}

  public searchHouses(query: HouseSerachQuery) {
    return this.search.search({
      registerId: 'BtiBuilding',
      layoutId: 6030001,
      query: {
        searchData: {
          Street: query.street,
        },
        dynamicControlData: {
          validHouse: true,
          buildingNum: query.buildingNum,
          housingNum: query.housingNum,
          structureNum: query.structureNum,
        },
      },
    });
  }
}
