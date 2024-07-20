import { FacetFilter } from '@urgp/client/shared';
import { LucideProps } from 'lucide-react';
import { relocationTypes } from './relocationTypes';

type Option = {
  value: number;
  label: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
};
interface RelocationTypeFacetFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedValues: number[];
  setSelectedValues: (value: number[]) => void;
  title?: string;
}

const options: Option[] = relocationTypes;

function RelocationTypeFacetFilter(
  props: RelocationTypeFacetFilterProps,
): JSX.Element {
  const {
    selectedValues = [],
    className,
    title = 'Тип переселения',
    setSelectedValues,
  } = props;

  return (
    <FacetFilter
      options={options}
      title={title}
      selectedValues={selectedValues}
      className={className}
      setSelectedValues={setSelectedValues}
    />
  );
}

export { RelocationTypeFacetFilter };
