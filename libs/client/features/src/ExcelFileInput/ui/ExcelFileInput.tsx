import { Button, cn, Input } from '@urgp/client/shared';
import { Upload } from 'lucide-react';
import React, { forwardRef, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

type ExcelFileInputProps = {
  label?: string;
  extraElement?: JSX.Element | string;
  setData: (data: any[]) => void;
  setIsParsing?: (isParsing: boolean) => void;
  parseData?: (data: any[]) => any[];
  className?: string;
  containerClassName?: string;
  inputId?: string;
  setFileName?: (name: string) => void;
  fileName?: string | null;
};

const ExcelFileInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & ExcelFileInputProps
>((props: ExcelFileInputProps, ref): JSX.Element => {
  const {
    setData,
    setIsParsing,
    parseData,
    label = 'Выбрать файл',
    extraElement = '.xls или .xlsx',
    className,
    containerClassName,
    inputId = 'excel-file-input',
    setFileName,
    fileName = null,
  } = props;

  // const [fi, setFile] = useState<File | null>(null);

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
      setFileName && setFileName(file.name);
      setIsParsing && setIsParsing(false);
    };
    setIsParsing && setIsParsing(true);
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className={containerClassName}>
      <label
        // htmlFor={inputId}
        className={cn(
          'flex justify-between truncate text-left',
          'mb-2 text-sm font-medium leading-none',
        )}
      >
        <span>{label || ''}</span>
      </label>
      <div
        className={cn(
          'group relative',
          'ring-offset-background first-focus-visible:ring-ring first-focus-visible:outline-none first-focus-visible:ring-2 first-focus-visible:ring-offset-2 first-disabled:cursor-not-allowed first-disabled:opacity-50',
          'border-input bg-muted-foreground/5 flex items-center justify-center rounded-md border border-dashed px-3 py-2',
          className,
        )}
      >
        <input
          id={inputId}
          ref={ref}
          type={'file'}
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className={cn(
            'cursor-pointer" absolute inset-0 h-full w-full opacity-0',
          )}
        />

        <div className="pointer-events-none flex flex-col items-center justify-center gap-2 p-4">
          <div className="bg-muted-foreground/10 flex flex-row items-center gap-2 rounded-full p-3 transition-transform group-hover:scale-105">
            <Upload className="size-8 flex-shrink-0" />
            {/* <span>Обзор</span> */}
          </div>

          <div className="text-center">
            <p className="font-medium">
              {fileName ?? 'Кликните или перетащите файл'}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{extraElement}</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ExcelFileInput;
