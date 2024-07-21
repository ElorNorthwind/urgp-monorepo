import { Button, FacetFilter, HStack } from '@urgp/client/shared';
import { GetOldBuldingsDto } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { AreaFacetFilter } from './AreaFacetFilter';
import { relocationTypes } from '../config/relocationTypes';

type OldBuildingsFilterProps = {
  filters: GetOldBuldingsDto;
  setFilters: (value: Partial<GetOldBuldingsDto>) => void;
};

const OldBuildingsFilter = ({
  filters,
  setFilters,
}: OldBuildingsFilterProps): JSX.Element => {
  return (
    <HStack>
      <AreaFacetFilter
        title="Район"
        selectedValues={filters.districts}
        setSelectedValues={(value) =>
          setFilters({
            districts: value && value.length > 0 ? value : undefined,
          })
        }
      />

      <FacetFilter
        options={relocationTypes}
        title={'Тип переселения'}
        selectedValues={filters.relocationType}
        setSelectedValues={(value) =>
          setFilters({
            relocationType: value && value.length > 0 ? value : undefined,
          })
        }
      />

      {filters && (
        <Button
          variant="ghost"
          onClick={() =>
            setFilters({ districts: undefined, relocationType: undefined })
          }
          className="h-8 px-2 lg:px-3"
        >
          Сброс
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
    </HStack>
  );
};

export { OldBuildingsFilter };
