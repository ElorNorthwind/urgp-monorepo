function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const NotificationPeriod = {
  none: 'none',
  daily: 'daily',
  weekly: 'weekly',
} as const;
export type NotificationPeriod =
  (typeof NotificationPeriod)[keyof typeof NotificationPeriod];
export const notificationPeriodsValues = getValues(NotificationPeriod);
