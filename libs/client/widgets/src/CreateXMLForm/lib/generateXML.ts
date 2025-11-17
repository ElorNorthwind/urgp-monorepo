import { format } from 'date-fns';
import { rdTemplates } from '../config/templates';
import { escapeXml } from './excapeText';
import { toast } from 'sonner';
import { RdType, RdXMLFormValues } from '@urgp/shared/entities';
import { formatObjectsList } from './formatObjectsList';

// Component with download functionality
export const generateXml = (data: RdXMLFormValues) => {
  const template = rdTemplates?.[data.rdType];
  if (!template) {
    toast.error('Не найден шаблон XML файла!');
    return;
  }

  if (data?.rdType === RdType.PremisesToNonResidentialExclusion) {
  }

  // Replace placeholders with escaped values
  const xmlContent = template
    .replace('{{guid}}', escapeXml(data?.guid || ''))
    .replace('{{rdNum}}', escapeXml(data?.rdNum || ''))
    .replace('{{rdNum}}', escapeXml(data?.rdNum || ''))
    .replace(
      '{{rdDate}}',
      escapeXml(format(data?.rdDate || '', 'yyyy-MM-dd') + '+3:00'),
    )
    .replace(
      '{{rdDate}}',
      escapeXml(format(data?.rdDate || '', 'yyyy-MM-dd') + '+3:00'),
    )
    .replace('{{fileName}}', escapeXml(data?.fileName || ''))
    .replace(
      '{{cadNum}}',
      data?.rdType === RdType.PremisesToNonResidentialExclusion
        ? formatObjectsList(
            data?.cadNum
              ?.replace(/\s{2,}/g, ' ')
              .replace(/[\n\s\,\;]/g, '\n')
              .split('\n'),
            '206001000000',
          ).join('\n')
        : escapeXml(data?.cadNum || ''),
    );

  // Create Blob and download
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'KAISToGKN_' + data.guid + '.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
