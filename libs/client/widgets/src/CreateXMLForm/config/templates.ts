import { RdType } from '../model/types';

const PremiseToResidential = `<?xml version="1.0" encoding="UTF-8"?>
<KAISToGKN xmlns="urn://x-artefacts-rosreestr-ru/incoming/kais-to-gkn/5.0.4" xmlns:ns6="urn://x-artefacts-rosreestr-ru/commons/complex-types/person/5.0.2" xmlns:ns5="urn://x-artefacts-rosreestr-ru/commons/complex-types/governance/5.0.1" xmlns:ns7="urn://x-artefacts-rosreestr-ru/commons/complex-types/assignation-flat/1.0.1" xmlns:ns0="urn://x-artefacts-smev-gov-ru/supplementary/commons/1.0.1" xmlns:ns2="urn://x-artefacts-rosreestr-ru/commons/complex-types/sender/5.0.1" xmlns:ns1="urn://x-artefacts-rosreestr-ru/commons/complex-types/document-info/5.0.1" xmlns:ns4="urn://x-artefacts-rosreestr-ru/commons/complex-types/address-input/6.0.1" xmlns:ns3="urn://x-artefacts-rosreestr-ru/commons/complex-types/organization/4.0.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" GUID="{{guid}}" NameSoftware="КАИС &quot;МЖР&quot;" VersionSoftware="05">
   <Title>
      <ns1:CodeDocument>558216000000</ns1:CodeDocument>
      <ns1:Name>Распоряжение Департамента о переводе нежилого помещения в жилое помещение в многоквартирном доме и включении его в жилищный фонд города Москвы</ns1:Name>
      <ns1:Number>{{rdNum}}</ns1:Number>
      <ns1:Date>{{rdDate}}</ns1:Date>
      <ns1:IssueOrgan>Департамент городского имущества города Москвы</ns1:IssueOrgan>
   </Title>
   <Declarant>
      <ns2:Governance>
         <ns5:Name>Департамент городского имущества города Москвы</ns5:Name>
         <ns5:GovernanceCode>007001001002</ns5:GovernanceCode>
      </ns2:Governance>
      <ns2:Agent>
         <ns0:FamilyName>Биктимиров</ns0:FamilyName>
         <ns0:FirstName>Руслан</ns0:FirstName>
         <ns0:Patronymic>Гумерович</ns0:Patronymic>
         <ns6:Document>
            <ns6:CodeDocument>008001001000</ns6:CodeDocument>
            <ns6:Name>Паспорт гражданина РФ</ns6:Name>
            <ns6:Series>92 05</ns6:Series>
            <ns6:Number>922121</ns6:Number>
            <ns6:Date>2006-01-01+03:00</ns6:Date>
            <ns6:IssueOrgan>УВД АВИАСТРОИТЕЛЬНОГО РАЙОНА ГОР. КАЗАНИ</ns6:IssueOrgan>
         </ns6:Document>
         <ns6:Email>BiktimirovRG_Z@mos.ru</ns6:Email>
         <ns6:Telephone>8 495 957-75-00</ns6:Telephone>
         <ns2:Appointment>Заместитель руководителя Департамента городского имущества города Москвы</ns2:Appointment>
      </ns2:Agent>
   </Declarant>
   <Document>
      <ns1:CodeDocument>558216000000</ns1:CodeDocument>
      <ns1:Name>Распоряжение Департамента о переводе нежилого помещения в жилое помещение в многоквартирном доме и включении его в жилищный фонд города Москвы</ns1:Name>
      <ns1:Number>{{rdNum}}</ns1:Number>
      <ns1:Date>{{rdDate}}</ns1:Date>
      <ns1:IssueOrgan>Департамент городского имущества города Москвы</ns1:IssueOrgan>
      <ns1:AppliedFile Kind="01" Name="{{fileName}}"/>
   </Document>
   <Objects>
      
   <Object>
         <CadastralNumber>{{cadNum}}</CadastralNumber>
         <FlatAssignation>
            <ns7:AssignationCode>206002000000</ns7:AssignationCode>
            <ns7:AssignationType>205001000000</ns7:AssignationType>
         </FlatAssignation>
      </Object></Objects>
</KAISToGKN>`;

const PremiseToNonResidential = `<?xml version="1.0" encoding="UTF-8"?>
<KAISToGKN xmlns="urn://x-artefacts-rosreestr-ru/incoming/kais-to-gkn/5.0.4" xmlns:ns6="urn://x-artefacts-rosreestr-ru/commons/complex-types/person/5.0.2" xmlns:ns5="urn://x-artefacts-rosreestr-ru/commons/complex-types/governance/5.0.1" xmlns:ns7="urn://x-artefacts-rosreestr-ru/commons/complex-types/assignation-flat/1.0.1" xmlns:ns0="urn://x-artefacts-smev-gov-ru/supplementary/commons/1.0.1" xmlns:ns2="urn://x-artefacts-rosreestr-ru/commons/complex-types/sender/5.0.1" xmlns:ns1="urn://x-artefacts-rosreestr-ru/commons/complex-types/document-info/5.0.1" xmlns:ns4="urn://x-artefacts-rosreestr-ru/commons/complex-types/address-input/6.0.1" xmlns:ns3="urn://x-artefacts-rosreestr-ru/commons/complex-types/organization/4.0.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" GUID="{{guid}}" NameSoftware="КАИС &quot;МЖР&quot;" VersionSoftware="05">
   <Title>
      <ns1:CodeDocument>558216000000</ns1:CodeDocument>
      <ns1:Name>Распоряжение Департамента об исключении из жилищного фонда города Москвы жилого помещения и переводе его в нежилой фонд</ns1:Name>
      <ns1:Number>{{rdNum}}</ns1:Number>
      <ns1:Date>{{rdDate}}</ns1:Date>
      <ns1:IssueOrgan>Департамент городского имущества города Москвы</ns1:IssueOrgan>
   </Title>
   <Declarant>
      <ns2:Governance>
         <ns5:Name>Департамент городского имущества города Москвы</ns5:Name>
         <ns5:GovernanceCode>007001001002</ns5:GovernanceCode>
      </ns2:Governance>
      <ns2:Agent>
         <ns0:FamilyName>Биктимиров</ns0:FamilyName>
         <ns0:FirstName>Руслан</ns0:FirstName>
         <ns0:Patronymic>Гумерович</ns0:Patronymic>
         <ns6:Document>
            <ns6:CodeDocument>008001001000</ns6:CodeDocument>
            <ns6:Name>Паспорт гражданина РФ</ns6:Name>
            <ns6:Series>92 05</ns6:Series>
            <ns6:Number>922121</ns6:Number>
            <ns6:Date>2006-01-01+03:00</ns6:Date>
            <ns6:IssueOrgan>УВД АВИАСТРОИТЕЛЬНОГО РАЙОНА ГОР. КАЗАНИ</ns6:IssueOrgan>
         </ns6:Document>
         <ns6:Email>BiktimirovRG_Z@mos.ru</ns6:Email>
         <ns6:Telephone>8 495 957-75-00</ns6:Telephone>
         <ns2:Appointment>Заместитель руководителя Департамента городского имущества города Москвы</ns2:Appointment>
      </ns2:Agent>
   </Declarant>
   <Document>
      <ns1:CodeDocument>558216000000</ns1:CodeDocument>
      <ns1:Name>Распоряжение Департамента об исключении из жилищного фонда города Москвы жилого помещения и переводе его в нежилой фонд</ns1:Name>
      <ns1:Number>{{rdNum}}</ns1:Number>
      <ns1:Date>{{rdDate}}</ns1:Date>
      <ns1:IssueOrgan>Департамент городского имущества города Москвы</ns1:IssueOrgan>
      <ns1:AppliedFile Kind="01" Name="{{fileName}}"/>
   </Document>
   <Objects>
      <Object>
         <CadastralNumber>{{cadNum}}</CadastralNumber>
         <FlatAssignation>
            <ns7:AssignationCode>206001000000</ns7:AssignationCode>
         </FlatAssignation>
      </Object>
   </Objects>
</KAISToGKN>`;

const BuildingToNonResidential = `<?xml version="1.0" encoding="UTF-8"?>
<KAISToGKN xmlns="urn://x-artefacts-rosreestr-ru/incoming/kais-to-gkn/5.0.4" xmlns:ns6="urn://x-artefacts-rosreestr-ru/commons/complex-types/person/5.0.2" xmlns:ns5="urn://x-artefacts-rosreestr-ru/commons/complex-types/governance/5.0.1" xmlns:ns7="urn://x-artefacts-rosreestr-ru/commons/complex-types/assignation-flat/1.0.1" xmlns:ns0="urn://x-artefacts-smev-gov-ru/supplementary/commons/1.0.1" xmlns:ns2="urn://x-artefacts-rosreestr-ru/commons/complex-types/sender/5.0.1" xmlns:ns1="urn://x-artefacts-rosreestr-ru/commons/complex-types/document-info/5.0.1" xmlns:ns4="urn://x-artefacts-rosreestr-ru/commons/complex-types/address-input/6.0.1" xmlns:ns3="urn://x-artefacts-rosreestr-ru/commons/complex-types/organization/4.0.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" GUID="{{guid}}" NameSoftware="КАИС &quot;МЖР&quot;" VersionSoftware="05">
   <Title>
      <ns1:CodeDocument>558216000000</ns1:CodeDocument>
      <ns1:Name>Распоряжение Департамента о переводе жилого дома в нежилой фонд</ns1:Name>
      <ns1:Number>{{rdNum}}</ns1:Number>
      <ns1:Date>{{rdDate}}</ns1:Date>
      <ns1:IssueOrgan>Департамент городского имущества города Москвы</ns1:IssueOrgan>
   </Title>
   <Declarant>
      <ns2:Governance>
         <ns5:Name>Департамент городского имущества города Москвы</ns5:Name>
         <ns5:GovernanceCode>007001001002</ns5:GovernanceCode>
      </ns2:Governance>
      <ns2:Agent>
         <ns0:FamilyName>Биктимиров</ns0:FamilyName>
         <ns0:FirstName>Руслан</ns0:FirstName>
         <ns0:Patronymic>Гумерович</ns0:Patronymic>
         <ns6:Document>
            <ns6:CodeDocument>008001001000</ns6:CodeDocument>
            <ns6:Name>Паспорт гражданина РФ</ns6:Name>
            <ns6:Series>92 05</ns6:Series>
            <ns6:Number>922121</ns6:Number>
            <ns6:Date>2006-01-01+03:00</ns6:Date>
            <ns6:IssueOrgan>УВД АВИАСТРОИТЕЛЬНОГО РАЙОНА ГОР. КАЗАНИ</ns6:IssueOrgan>
         </ns6:Document>
         <ns6:Email>BiktimirovRG_Z@mos.ru</ns6:Email>
         <ns6:Telephone>8 495 957-75-00</ns6:Telephone>
         <ns2:Appointment>Заместитель руководителя Департамента городского имущества города Москвы</ns2:Appointment>
      </ns2:Agent>
   </Declarant>
   <Document>
      <ns1:CodeDocument>558216000000</ns1:CodeDocument>
      <ns1:Name>Распоряжение Департамента о переводе жилого дома в нежилой фонд</ns1:Name>
      <ns1:Number>{{rdNum}}</ns1:Number>
      <ns1:Date>{{rdDate}}</ns1:Date>
      <ns1:IssueOrgan>Департамент городского имущества города Москвы</ns1:IssueOrgan>
      <ns1:AppliedFile Kind="01" Name="{{fileName}}"/>
   </Document>
   <Objects>
      <Object>
         <CadastralNumber>{{cadNum}}</CadastralNumber>
         <FlatAssignation>
            <ns7:AssignationCode>204001000000</ns7:AssignationCode>
         </FlatAssignation>
      </Object>
   </Objects>
</KAISToGKN>`;

export const rdTemplates = {
  [RdType.PremiseToResidential]: PremiseToResidential,
  [RdType.PremiseToNonResidential]: PremiseToNonResidential,
  [RdType.BuildingToNonResidential]: BuildingToNonResidential,
} as Record<RdType, string>;
