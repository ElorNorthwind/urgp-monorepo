// import { Test, TestingModule } from '@nestjs/testing';
// import { UnauthorizedException, BadRequestException } from '@nestjs/common';
// import { ControlOperationsService } from './control-operations.service';
// import { ControlCasesService } from './control-cases.service';
// import { ControlClassificatorsService } from './control-classificators.service';
// import {
//   defineControlAbilityFor,
//   OperationSlim,
//   UpdateOperationDto,
// } from '@urgp/shared/entities';

// const mockedUser = {
//   id: 1,
//   login: 'shepelevsa',
//   fio: 'Шепелев С.А.',
//   tokenVersion: 1,
//   roles: ['user'],
//   controlData: {
//     roles: ['user'],
//     priority: 3,
//     approvers: {
//       cases: [1, 5],
//       problems: [1, 5],
//       operations: [1, 5],
//     },
//   },
// };

// const mockedStage = {
//   id: 74,
//   caseId: 2,
//   class: 'stage',
//   typeId: 7,
//   authorId: 1,
//   updatedById: 1,
//   controlFromId: null,
//   controlToId: null,
//   approveFromId: 1,
//   approveToId: 1,
//   approveStatus: 'approved',
//   approveDate: '2025-01-11T16:00:32.445Z',
//   approveNotes: null,
//   createdAt: '2025-01-11T16:00:32.000Z',
//   updatedAt: '2025-01-11T16:07:20.537Z',
//   dueDate: null,
//   doneDate: '2025-01-10T21:00:00.000Z',
//   title: '',
//   notes: 'Проблемы на самом деле нету, все вы врете!',
//   extra: null,
// } as OperationSlim;

// const mockedOperationTypes = [
//   {
//     id: 1,
//     name: 'письмо',
//     category: 'рассмотрение',
//     fullname: 'Направлено письмо',
//     priority: 1,
//     autoApprove: true,
//   },
//   {
//     id: 2,
//     name: 'решено (исп)',
//     category: 'решение',
//     fullname: 'Описанная проблема решена',
//     priority: 2,
//     autoApprove: false,
//   },
// ];

// describe('getCorrectApproveData', () => {
//   let operationsService: ControlOperationsService;
//   let casesService: ControlCasesService;
//   let classificatorsService: ControlClassificatorsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         {
//           provide: ControlOperationsService,
//           useValue: {
//             readOperation: jest.fn(),
//           },
//         },
//         {
//           provide: ControlCasesService,
//           useValue: {
//             readSlimCase: jest.fn(),
//             readFullCase: jest.fn(),
//           },
//         },
//         {
//           provide: ControlClassificatorsService,
//           useValue: {
//             getCorrectApproveData:
//               ControlClassificatorsService.prototype.getCorrectApproveData,
//             isAutoApproved:
//               ControlClassificatorsService.prototype.isAutoApproved,
//             getOperationTypesFlat: jest.fn(),
//             getEntity: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     operationsService = module.get<ControlOperationsService>(
//       ControlOperationsService,
//     );
//     casesService = module.get<ControlCasesService>(ControlCasesService);
//     classificatorsService = module.get<ControlClassificatorsService>(
//       ControlClassificatorsService,
//     );
//   });

//   it('should return auto-approved data if typeId is auto-approved', async () => {
//     const dto = {
//       caseId: 1,
//       class: 'stage',
//       typeId: 1,
//       authorId: 1,
//       approveFromId: 1,
//       approveToId: 1,
//       approveStatus: null,
//       approveDate: null,
//     } as unknown as UpdateOperationDto;
//     const isOperation = true;

//     jest
//       .spyOn(operationsService, 'readOperations')
//       .mockResolvedValue(mockedStage);
//     jest
//       .spyOn(classificatorsService, 'getOperationTypesFlat')
//       .mockResolvedValue(mockedOperationTypes);
//     jest
//       .spyOn(classificatorsService, 'getEntity')
//       .mockResolvedValue(mockedStage);

//     const result = await classificatorsService.getCorrectApproveData({
//       user: mockedUser,
//       dto,
//       isOperation,
//     });

//     expect(result).toEqual({
//       approveStatus: 'approved',
//       approveFromId: 1,
//       approveToId: 1,
//       approveDate: expect.any(String),
//       approveNotes: 'Операция не требует согласования',
//     });
//   });

//   it('should return project status if approveToId is 0 or undefined', async () => {
//     const dto = {
//       approveToId: 0,
//       approveStatus: 'project',
//     } as unknown as UpdateOperationDto;
//     const isOperation = false;

//     const result = await classificatorsService.getCorrectApproveData({
//       user: mockedUser,
//       dto,
//       isOperation,
//     });

//     expect(result).toEqual({
//       approveStatus: 'project',
//       approveFromId: 1,
//       approveToId: null,
//       approveDate: null,
//       approveNotes: null,
//     });
//   });

//   it('should throw UnauthorizedException if user cannot approve', async () => {
//     const dto = {
//       approveToId: 2,
//       approveStatus: 'pending',
//     } as unknown as UpdateOperationDto;
//     const isOperation = true;

//     jest
//       .spyOn(operationsService, 'readOperation')
//       .mockResolvedValue(mockedStage);
//     jest
//       .spyOn(classificatorsService, 'getOperationTypesFlat')
//       .mockResolvedValue(mockedOperationTypes);

//     // Mock permission check to throw an error
//     jest
//       .spyOn(defineControlAbilityFor(mockedUser), 'cannot')
//       .mockReturnValue(true);

//     await expect(
//       classificatorsService.getCorrectApproveData({
//         user: mockedUser,
//         dto,
//         isOperation,
//       }),
//     ).rejects.toThrow(UnauthorizedException);
//   });

//   it('should throw UnauthorizedException if user cannot set approver', async () => {
//     const dto = {
//       approveToId: 100,
//       approveStatus: 'pending',
//     } as unknown as UpdateOperationDto;
//     const isOperation = true;

//     jest
//       .spyOn(operationsService, 'readOperation')
//       .mockResolvedValue(mockedStage);
//     jest
//       .spyOn(classificatorsService, 'getOperationTypesFlat')
//       .mockResolvedValue(mockedOperationTypes);

//     // // Mock permission check to throw an error
//     // jest
//     //   .spyOn(defineControlAbilityFor(mockedUser), 'cannot')
//     //   .mockImplementation((action) => {
//     //     if (action === 'set-approver') return true;
//     //     return false;
//     //   });

//     await expect(
//       classificatorsService.getCorrectApproveData({
//         user: mockedUser,
//         dto,
//         isOperation,
//       }),
//     ).rejects.toThrow(UnauthorizedException);
//   });

//   it('should return pending status if approveToId is not the user', async () => {
//     const dto = {
//       class: 'stage',
//       approveToId: 5,
//       approveStatus: 'pending',
//     } as unknown as UpdateOperationDto;
//     const isOperation = true;

//     jest
//       .spyOn(operationsService, 'readOperation')
//       .mockResolvedValue(mockedStage);
//     jest
//       .spyOn(classificatorsService, 'getOperationTypesFlat')
//       .mockResolvedValue(mockedOperationTypes);

//     const result = await classificatorsService.getCorrectApproveData({
//       user: mockedUser,
//       dto,
//       isOperation,
//     });

//     expect(result).toEqual({
//       approveStatus: 'pending',
//       approveFromId: 1,
//       approveToId: 5,
//       approveDate: null,
//       approveNotes: null,
//     });
//   });

//   // Не требуется, это поле не идет в БД напрямую
//   // it('should throw BadRequestException for unexpected scenarios', async () => {
//   //   const dto = {
//   //     class: 'stage',
//   //     approveToId: 5,
//   //     approveStatus: 'invalid-status',
//   //   } as unknown as UpdateOperationDto;
//   //   const isOperation = true;

//   //   jest
//   //     .spyOn(operationsService, 'readOperation')
//   //     .mockResolvedValue(mockedStage);
//   //   jest
//   //     .spyOn(classificatorsService, 'getOperationTypesFlat')
//   //     .mockResolvedValue(mockedOperationTypes);

//   //   await expect(
//   //     classificatorsService.getCorrectApproveData({
//   //       user: mockedUser,
//   //       dto,
//   //       isOperation,
//   //     }),
//   //   ).rejects.toThrow(BadRequestException);
//   // });
// });
