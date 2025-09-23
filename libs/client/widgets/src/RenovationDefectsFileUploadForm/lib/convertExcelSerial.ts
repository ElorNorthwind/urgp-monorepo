export function convertExcelSerial(excelSerial?: number) {
  if (!excelSerial || typeof excelSerial !== 'number') {
    return null;
  }
  // Excel's epoch is 1899-12-30 (due to the 1900 leap year bug)
  // JavaScript's epoch is 1970-01-01
  const excelEpochAsMs = new Date(Date.UTC(1899, 11, 30)).getTime();
  const msPerDay = 24 * 60 * 60 * 1000;

  // Convert the Excel serial number to milliseconds since Excel's epoch
  const excelDateInMs = excelSerial * msPerDay;

  // Add the difference between Excel's epoch and JS epoch
  const jsDateInMs = excelEpochAsMs + excelDateInMs;

  return new Date(jsDateInMs).toISOString();
}
