// eslint-disable-next-line @nx/enforce-module-boundaries
import { FacetFilter } from '@urgp/client/shared';
import {
  CheckIcon,
  HouseIcon,
  LucideProps,
  PlusCircleIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

function OldBuildingsFilter(
  props: React.HTMLAttributes<HTMLDivElement>,
): JSX.Element {
  const { className } = props;

  const [selectedValues, setSelectedItems] = useState<string[]>([]);

  const options = useMemo(() => {
    return [
      { value: '1', label: 'один', icon: PlusCircleIcon },
      { value: '2', label: 'дыва', icon: CheckIcon },
      { value: '3', label: 'тры', icon: HouseIcon },
    ];
  }, []);

  return (
    <FacetFilter
      {...props}
      title={'Статус'}
      options={options}
      selectedValues={selectedValues}
      setSelectedValues={(value) => setSelectedItems(value)}
    />
  );
}

export { OldBuildingsFilter };
