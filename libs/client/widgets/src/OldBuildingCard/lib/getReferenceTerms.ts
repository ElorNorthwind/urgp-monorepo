import { OldBuilding } from '@urgp/shared/entities';

export function getReferenceTerms(apart: OldBuilding['problematicAparts'][0]) {
  return [
    // {
    //   label: 'Создано КПУ',
    //   date: apart.stages.order.date,
    //   days: apart.stages.order.days,
    // },
    {
      label: 'На осмотре',
      date: apart.stages.inspection.date,
      days: apart.stages.inspection.days,
    },
    {
      label: 'Отказ',
      date: apart.stages.reject.date,
      days: apart.stages.reject.days,
    },
    {
      label: 'Переподбор',
      date: apart.stages.reinspection.date,
      days: apart.stages.reinspection.days,
    },
    {
      label: 'Согласие',
      date: apart.stages.accept.date,
      days: apart.stages.accept.days,
    },
    {
      label: 'РД',
      date: apart.stages.rd.date,
      days: apart.stages.rd.days,
    },
    {
      label: 'Проект договора',
      date: apart.stages.contractProject.date,
      days: apart.stages.contractProject.days,
    },
    {
      label: 'Уведомление',
      date: apart.stages.contractNotification.date,
      days: apart.stages.contractNotification.days,
    },
    {
      label: 'Назначено подписание',
      date: apart.stages.contractPrelimenarySigning.date,
      days: apart.stages.contractPrelimenarySigning.days,
    },
    {
      label: 'Готовится иск',
      date: apart.stages.claimStart.date,
      days: apart.stages.claimStart.days,
    },
    {
      label: 'Судебные разбирательства',
      date: apart.stages.claimSubmit.date,
      days: apart.stages.claimSubmit.days,
    },
    {
      label: 'Решение суда',
      date: apart.stages.claimWon.date,
      days: apart.stages.claimWon.days,
    },
    {
      label: 'Не предлагалось (проигранный суд)',
      date: apart.stages.claimLost.date,
      days: apart.stages.claimLost.days,
    },
    {
      label: 'На осмотре (проиграный суд)',
      date: apart.stages.lostInspection.date,
      days: apart.stages.lostInspection.days,
    },
    {
      label: 'Согласие (проиграный суд)',
      date: apart.stages.lostAccept.date,
      days: apart.stages.lostAccept.days,
    },
    {
      label: 'РД (проиграный суд)',
      date: apart.stages.lostRd.date,
      days: apart.stages.lostRd.days,
    },
    {
      label: 'Проект договора (проиграный суд)',
      date: apart.stages.lostContractProject.date,
      days: apart.stages.lostContractProject.days,
    },
    {
      label: 'Назначено подписание (проиграный суд)',
      date: apart.stages.lostContractPrelimenarySigning.date,
      days: apart.stages.lostContractPrelimenarySigning.days,
    },
    {
      label: 'Запрошен ИЛ',
      date: apart.stages.fsspList.date,
      days: apart.stages.fsspList.days,
    },
    {
      label: 'Возбуждено ИП',
      date: apart.stages.fsspInstitute.date,
      days: apart.stages.fsspInstitute.days,
    },
    {
      label: 'РД (выигранный суд)',
      date: apart.stages.wonRd.date,
      days: apart.stages.wonRd.days,
    },
    {
      label: 'Проект договора (выигранный суд)',
      date: apart.stages.wonContractProject.date,
      days: apart.stages.wonContractProject.days,
    },
    {
      label: 'Договор подписан',
      date: apart.stages.contract.date,
      days: apart.stages.contract.days,
    },
  ].sort((a, b) => (a.days || 0) - (b.days || 0));
}
