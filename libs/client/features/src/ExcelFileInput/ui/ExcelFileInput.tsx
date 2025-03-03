import { cn, Input } from '@urgp/client/shared';
import React, { forwardRef, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

type ExcelFileInputProps = {
  label?: string;
  setData: (data: any[]) => void;
  setIsParsing?: (isParsing: boolean) => void;
  parseData?: (data: any[]) => any[];
  className?: string;
};

const ExcelFileInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & ExcelFileInputProps
>((props: ExcelFileInputProps, ref): JSX.Element => {
  const {
    setData,
    setIsParsing,
    parseData,
    label = 'Выберете файл',
    className,
  } = props;

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e?.target?.result) return;
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(parseData ? parseData(jsonData) : jsonData);
      setIsParsing && setIsParsing(false);
    };
    setIsParsing && setIsParsing(true);
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <p
        className={cn(
          'flex justify-between truncate text-left',
          'mb-2 text-sm font-medium leading-none',
        )}
      >
        <span>{label || ''}</span>
      </p>
      <input
        ref={ref}
        type={'file'}
        placeholder="Выберите файл"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className={cn(
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
    </div>
  );
});

export { ExcelFileInput };
