import { Button, FacetFilter, HStack } from '@urgp/client/shared';
import { GetOldBuldingsDto } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { AreaFacetFilter } from './AreaFacetFilter';
import { relocationTypes } from '../config/relocationTypes';

type OldBuildingsFilterProps = {
  filters: GetOldBuldingsDto;
  setFilters: React.Dispatch<React.SetStateAction<GetOldBuldingsDto>>;
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
        setSelectedValues={(value) => {
          setFilters((prev) => ({
            ...prev,
            districts: value && value.length > 0 ? value : undefined,
          }));
        }}
      />

      <FacetFilter
        options={relocationTypes}
        title={'Тип переселения'}
        selectedValues={filters.relocationType}
        setSelectedValues={(value) => {
          setFilters((prev) => ({
            ...prev,
            relocationType: value && value.length > 0 ? value : undefined,
          }));
        }}
      />

      {filters && Object.keys(filters).length > 0 && (
        <Button
          variant="ghost"
          onClick={() => setFilters({})}
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
