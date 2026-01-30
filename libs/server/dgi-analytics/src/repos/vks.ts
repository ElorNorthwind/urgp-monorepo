import { Logger } from '@nestjs/common';
import {
  BookingClient,
  BookingRecord,
  ClientSurveyResponse,
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  OperatorSurveyResponse,
  QmsQuery,
  VkaSetIsTechnical,
  VksCase,
  VksCaseDetails,
  VksCasesQuery,
  VksDashbordPageSearch,
  VksDepartmentStat,
  VksServiceStat,
  VksStatusStat,
  VksTimelinePoint,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { vks } from './sql/sql';
import {
  detailedCasesUnauthorizedColumns,
  slimCasesUnauthorizedColumns,
} from '../config';

// @Injectable()
export class VksRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  insertClients(clients: BookingClient[]): Promise<number> {
    const columns = [
      { name: 'id', prop: 'id' },
      { name: 'type', prop: 'type' },
      { name: 'surname', prop: 'surname' },
      { name: 'first_name', prop: 'firstName' },
      { name: 'last_name', prop: 'lastName' },
      { name: 'org_name', prop: 'orgName' },
      { name: 'snils', prop: 'snils' },
      { name: 'ogrn', prop: 'ogrn' },
      { name: 'inn', prop: 'inn' },
    ];
    const clientsColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'clients',
        schema: 'vks',
      },
    });

    const insert =
      this.pgp.helpers.insert(clients, clientsColumnSet) +
      ' ON CONFLICT (id) DO NOTHING RETURNING id;';
    return this.db.any(insert).then((result: any) => result?.length || 0);
  }

  insertCases(records: BookingRecord[]): Promise<number> {
    const columns = [
      // { name: 'id', prop: 'id', cnd: true },
      { name: 'org', prop: 'org' },
      { name: 'date', prop: 'date', cast: 'date' },
      { name: 'time', prop: 'time' },
      { name: 'service_id', prop: 'serviceId' },
      // { name: 'service_name', prop: 'serviceName' },
      { name: 'status', prop: 'status' },
      { name: 'case_count', prop: 'caseCount', def: 0 },
      { name: 'booking_id', prop: 'bookingId' },
      {
        name: 'booking_date',
        prop: 'bookingDate',
        cast: 'timestamp with time zone',
      },
      { name: 'booking_code', prop: 'bookingCode' },
      { name: 'booking_source', prop: 'bookingSource' },
      { name: 'booking_resource', prop: 'bookingResource' },
      { name: 'deputy_fio', prop: 'deputyFio' },
      { name: 'phone', prop: 'phone' },
      { name: 'email', prop: 'email' },
      { name: 'tiken_num', prop: 'tikenNum' },
      {
        name: 'tiket_call_time',
        prop: 'tiketCallTime',
        cast: 'timestamp with time zone',
      },
      {
        name: 'tiket_cancel_user_time',
        prop: 'tiketCancelUserTime',
        cast: 'timestamp with time zone',
      },
      {
        name: 'tiket_cancel_oiv_time',
        prop: 'tiketCancelOivTime',
        cast: 'timestamp with time zone',
      },
      { name: 'problem_audio', prop: 'problemAudio' },
      { name: 'problem_video', prop: 'problemVideo' },
      { name: 'problem_connection', prop: 'problemConnection' },
      { name: 'problem_tech', prop: 'problemTech' },
      { name: 'vks_search_speed', prop: 'vksSearchSpeed' },
      { name: 'online_grade', prop: 'onlineGrade', cast: 'integer' },
      { name: 'online_grade_comment', prop: 'onlineGradeComment' },
      { name: 'operator_link', prop: 'operatorLink' },
      { name: 'participant_fio', prop: 'participantFio' },
      { name: 'problem_summary', prop: 'problemSummary' },
      { name: 'address', prop: 'address' },
      { name: 'contract_number', prop: 'contractNumber' },
      { name: 'letter_number', prop: 'letterNumber' },
      { name: 'fls_number', prop: 'flsNumber' },
      { name: 'client_id', prop: 'clientId', cast: 'bigint' },
    ];

    const casesColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'cases',
        schema: 'vks',
      },
    });

    const onConflict = `
DO UPDATE 
SET (
    date,
    time,
    status,
    deputy_fio,
    phone,
    email,
    tiket_call_time,
    tiket_cancel_user_time,
    tiket_cancel_oiv_time,
    problem_audio,
    problem_video,
    problem_connection,
    problem_tech,
    vks_search_speed,
    online_grade,
    online_grade_comment,
    operator_link,
    participant_fio,
    problem_summary,
    address,
    contract_number,
    letter_number,
    fls_number
) = (
    EXCLUDED.date,
    EXCLUDED.time,
    EXCLUDED.status,
    EXCLUDED.deputy_fio,
    EXCLUDED.phone,
    EXCLUDED.email,
    EXCLUDED.tiket_call_time,
    EXCLUDED.tiket_cancel_user_time,
    EXCLUDED.tiket_cancel_oiv_time,
    EXCLUDED.problem_audio,
    EXCLUDED.problem_video,
    EXCLUDED.problem_connection,
    EXCLUDED.problem_tech,
    EXCLUDED.vks_search_speed,
    EXCLUDED.online_grade,
    EXCLUDED.online_grade_comment,
    EXCLUDED.operator_link,
    EXCLUDED.participant_fio,
    EXCLUDED.problem_summary,
    EXCLUDED.address,
    EXCLUDED.contract_number,
    EXCLUDED.letter_number,
    EXCLUDED.fls_number
)`;

    const insert =
      this.pgp.helpers.insert(records, casesColumnSet) +
      ` ON CONFLICT (booking_code, date) ${onConflict || 'DO NOTHING'} RETURNING id;`;
    return this.db.any(insert).then((result: any) => result?.length || 0);
  }

  updateOperatorSurveys(surveys: OperatorSurveyResponse[]): Promise<number> {
    const columns = [
      {
        name: 'booking_code',
        prop: 'bookingCode',
        cnd: true,
      },
      { name: 'operator_survey_id', prop: 'id' },
      {
        name: 'operator_survey_date',
        prop: 'date',
        cast: 'timestamp with time zone',
      },
      { name: 'operator_survey_status', prop: 'status' },
      {
        name: 'operator_survey_extralink_id',
        prop: 'extralinkId',
      },

      {
        name: 'operator_survey_extralink_url',
        prop: 'extralinkUrl',
      },
      { name: 'operator_survey_fio', prop: 'operatorFio' },
      {
        name: 'operator_survey_consultation_type',
        prop: 'consultationType',
      },
      {
        name: 'operator_survey_is_housing',
        prop: 'isHousingQuestion',
      },
      { name: 'operator_survey_is_client', prop: 'isClient' },
      { name: 'operator_survey_address', prop: 'registrationAddress' },
      { name: 'operator_survey_relation', prop: 'relationsToMoscow' },
      { name: 'operator_survey_doc_type', prop: 'documentType' },
      { name: 'operator_survey_doc_date', prop: 'documentDate' },
      { name: 'operator_survey_doc_num', prop: 'documentNumber' },
      {
        name: 'operator_survey_department',
        prop: 'department',
      },
      { name: 'operator_survey_summary', prop: 'questionSummary' },
      { name: 'operator_survey_mood', prop: 'mood' },
      {
        name: 'operator_survey_needs_answer',
        prop: 'needsAnswer',
      },
      { name: 'operator_survey_problems', prop: 'problems', cast: 'text[]' },
      {
        name: 'operator_survey_info_source',
        prop: 'informationSource',
      },
    ];

    const operatorSurveyColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'cases',
        schema: 'vks',
      },
    });

    const update =
      this.pgp.helpers.update(surveys, operatorSurveyColumnSet) +
      ` WHERE t.booking_code = v.booking_code AND v.operator_survey_date::date - t.date BETWEEN 0 AND 90 AND t.operator_survey_id IS NULL RETURNING id;`;
    return this.db.any(update).then((result: any) => result?.length || 0);
  }

  updateClientSurveys(surveys: ClientSurveyResponse[]): Promise<number> {
    const columns = [
      {
        name: 'booking_code',
        prop: 'bookingCode',
        cnd: true,
      },
      { name: 'client_survey_id', prop: 'id' },
      {
        name: 'client_survey_date',
        prop: 'date',
        cast: 'timestamp with time zone',
      },
      { name: 'client_survey_status', prop: 'status' },
      {
        name: 'client_survey_extralink_id',
        prop: 'extralinkId',
      },

      {
        name: 'client_survey_extralink_url',
        prop: 'extralinkUrl',
      },
      { name: 'client_survey_joined', prop: 'operatorJoined', cast: 'boolean' },
      {
        name: 'client_survey_consultation_received',
        prop: 'consultationReceived',
        cast: 'boolean',
      },
      { name: 'client_survey_grade', prop: 'operatorGrade', cast: 'integer' },
      { name: 'client_survey_comment_positive', prop: 'commentPositive' },
      { name: 'client_survey_comment_negative', prop: 'commentNegative' },
    ];

    const operatorSurveyColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'cases',
        schema: 'vks',
      },
    });

    const update =
      this.pgp.helpers.update(surveys, operatorSurveyColumnSet) +
      ` WHERE t.booking_code = v.booking_code AND v.client_survey_date::date - t.date BETWEEN 0 AND 90 AND t.client_survey_id IS NULL RETURNING id;`;
    return this.db.any(update).then((result: any) => result?.length || 0);
  }

  getKnownServiceIds(): Promise<number[]> {
    const query = 'SELECT id FROM vks.services;';
    return this.db
      .any(query)
      .then((result: any) => result.map((r: any) => r.id));
  }

  insertNewService(id: number, fullName: string): Promise<null> {
    const query =
      'INSERT INTO vks.services (id, full_name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING;';
    return this.db.none(query, [id, fullName]);
  }

  getVksCases(
    q: VksCasesQuery,
    isAuthorized: boolean = false,
  ): Promise<VksCase[]> {
    const query = isAuthorized
      ? 'SELECT * FROM vks.cases_slim_view WHERE date BETWEEN $1::date AND $2::date;'
      : `SELECT ${slimCasesUnauthorizedColumns} FROM vks.cases_slim_view WHERE date BETWEEN $1::date AND $2::date;`;
    return this.db.any(query, [
      q?.dateFrom || '-infinity',
      q?.dateTo || 'infinity',
    ]);
  }

  getVksCaseById(
    caseId: number,
    isAuthorized: boolean = false,
  ): Promise<VksCase | null> {
    const query = isAuthorized
      ? 'SELECT * FROM vks.cases_slim_view WHERE id = $1 LIMIT 1;'
      : `SELECT ${slimCasesUnauthorizedColumns} FROM vks.cases_slim_view WHERE id = $1 LIMIT 1;`;
    return this.db.oneOrNone(query, [caseId]);
  }

  getVksCaseDetailes(
    id: number,
    isAuthorized: boolean = false,
  ): Promise<VksCaseDetails> {
    const query = isAuthorized
      ? 'SELECT * FROM vks.cases_detailed_view WHERE id = $1;'
      : `SELECT ${detailedCasesUnauthorizedColumns} FROM vks.cases_detailed_view WHERE id = $1;`;
    return this.db.one(query, [id]);
  }

  getServiceTypeClassificator(): Promise<NestedClassificatorInfoString[]> {
    return this.db.any(vks.readServiceTypesClassificator);
  }

  getDepartmentsClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(vks.readDepartmentsClassificator);
  }

  getStatusClassificator(): Promise<NestedClassificatorInfoString[]> {
    return this.db.any(vks.readStatusClassificator);
  }

  getVksTimeline(departmentIds?: number[]): Promise<VksTimelinePoint[]> {
    const conditions =
      departmentIds && departmentIds.length > 0
        ? `AND dep.id IN (${departmentIds.join(',')})`
        : '';
    return this.db.any(vks.readVksTimeline, [conditions]);
  }

  getVksStatusStats(q: VksDashbordPageSearch): Promise<VksStatusStat[]> {
    const conditions =
      q.department && q.department.length > 0
        ? `AND d.id IN (${q.department.join(',')})`
        : '';
    return this.db.any(vks.readVksStatusStats, {
      conditions,
      dateFrom: q.dateFrom || '-infinity',
      dateTo: q.dateTo || 'infinity',
    });
  }

  getVksDepartmentStats(
    q: VksDashbordPageSearch,
  ): Promise<VksDepartmentStat[]> {
    const conditions =
      q.department && q.department.length > 0
        ? `AND d.id IN (${q.department.join(',')})`
        : '';
    return this.db.any(vks.readVksDepartmentStats, {
      conditions,
      dateFrom: q?.dateFrom || '-infinity',
      dateTo: q?.dateTo || 'infinity',
    });
  }

  getVksServiceStats(q: VksDashbordPageSearch): Promise<VksServiceStat[]> {
    const conditions =
      q.department && q.department.length > 0
        ? `AND d.id IN (${q.department.join(',')})`
        : '';
    return this.db.any(vks.readVksServiceStats, {
      conditions,
      dateFrom: q?.dateFrom || '-infinity',
      dateTo: q?.dateTo || 'infinity',
    });
  }

  setIsTechnical(q: VkaSetIsTechnical): Promise<boolean | null> {
    const sql = `UPDATE vks.cases SET is_technical = $1 WHERE id = $2 RETURNING is_technical;`;
    return this.db.oneOrNone(sql, [q.value, q.caseId]);
  }

  setEmptySlots(q: QmsQuery): Promise<null> {
    return this.db.none(vks.addVksEmptySlots, q);
  }
}
