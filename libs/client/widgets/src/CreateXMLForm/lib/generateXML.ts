import { format } from 'date-fns';
import { testTemplate } from '../config/templates';
import { RdXMLFormValues } from '../model/types';
import { escapeXml } from './excapeText';

// Component with download functionality
export const generateXml = (data: RdXMLFormValues) => {
  // Replace placeholders with escaped values
  const xmlContent = testTemplate
    .replace(
      '{{TITLE}}',
      escapeXml(format(data.rdDate, 'dd.MM.yyyy') + ' (+3 )'),
    )
    .replace('{{CONTENT}}', escapeXml(data.fileName));

  // Create Blob and download
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = data.guid + '.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
