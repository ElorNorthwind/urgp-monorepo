import * as XLSX from 'xlsx';

export const exportToExcel = (jsonData, fileName = 'export') => {
  // Convert JSON data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(jsonData);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Список');

  // Write the workbook to a file
  XLSX.writeFile(workbook, fileName + '.xlsx');
};
