import { cn } from '@urgp/client/shared';
import { Upload } from 'lucide-react';
import React, { forwardRef } from 'react';
import { RdXMLFileParseResult } from '@urgp/shared/entities';
import { extractDataFromDocx } from '../lib/extractDataFromDocx';
import { extractDataFromPDF } from '../lib/extractDataFromPDF';

type XMLFormFileInputProps = {
  label?: string;
  extraElement?: JSX.Element | string;
  className?: string;
  inputId?: string;

  setFileName?: (name: string) => void;
  fileName?: string | null;
  setData?: (cadNum: RdXMLFileParseResult) => void;
  onFinish?: () => void;
};

const XMLFormFileInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & XMLFormFileInputProps
>((props: XMLFormFileInputProps, ref): JSX.Element => {
  const {
    label = 'Выбрать файл',
    extraElement = '.docx или .pdf',
    className,
    inputId = 'xml-form-file-input',
    setFileName,
    fileName = null,
    setData,
    onFinish,
  } = props;

  // const [fi, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e?.target?.result) return;
      const arrayBuffer = e.target.result;

      const extension = file?.name?.split('.')?.pop() || '';

      if (extension === 'docx') {
        extractDataFromDocx(arrayBuffer as ArrayBuffer).then((data) => {
          setData && setData(data);
        });
        setFileName && setFileName(file?.name || '');
      }

      if (extension === 'pdf') {
        setData && setData(extractDataFromPDF(file?.name || ''));
        setFileName && setFileName(file?.name || '');
      }

      setFileName && setFileName(file.name);
    };
    reader.readAsArrayBuffer(file);
    onFinish && onFinish();
  };

  return (
    <div>
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
          accept=".docx, .pdf"
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

export default XMLFormFileInput;
