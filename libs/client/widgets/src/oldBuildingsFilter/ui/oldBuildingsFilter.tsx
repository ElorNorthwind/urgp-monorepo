import { Button, FacetFilter, HStack } from '@urgp/client/shared';
import { GetOldBuldingsDto } from '@urgp/shared/entities';
import { X } from 'lucide-react';
import { AreaFacetFilter } from './AreaFacetFilter';
import { relocationTypes } from '../config/relocationTypes';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

type OldBuildingsFilterProps = {
  // filters: GetOldBuldingsDto;
  // setFilters: React.Dispatch<React.SetStateAction<GetOldBuldingsDto>>;
};

const OldBuildingsFilter = (): JSX.Element => {
  const {
    limit,
    okrug,
    districts,
    relocationType,
    // status,
    // dificulty,
    // deviation,
    // relocationAge,
    // relocationStatus,
    // adress,
  } = getRouteApi('/oldbuildings').useSearch() as GetOldBuldingsDto;
  const navigate = useNavigate({ from: '/oldbuildings' });

  const setFilters = (value: Partial<GetOldBuldingsDto>) => {
    navigate({
      search: (prev: GetOldBuldingsDto) => ({
        ...prev,
        ...value,
      }),
    });
  };

  return (
    <HStack>
      <AreaFacetFilter
        title="Район"
        selectedValues={districts}
        setSelectedValues={(value) =>
          setFilters({
            districts: value && value.length > 0 ? value : undefined,
          })
        }
        // setSelectedValues={(value) =>
        //   navigate({
        //     search: (prev: GetOldBuldingsDto) => ({
        //       ...prev,
        //       districts: value && value.length > 0 ? value : undefined,
        //     }),
        //   })
        // }
      />

      <FacetFilter
        options={relocationTypes}
        title={'Тип переселения'}
        selectedValues={relocationType || []}
        setSelectedValues={(value) =>
          setFilters({
            relocationType: value && value.length > 0 ? value : undefined,
          })
        }

        // setSelectedValues={(value) =>
        //   navigate({
        //     search: (prev: GetOldBuldingsDto) => ({
        //       ...prev,
        //       relocationType: value && value.length > 0 ? value : undefined,
        //     }),
        //   })
        // }
      />

      {(districts || relocationType) && (
        <Button
          variant="ghost"
          onClick={() =>
            navigate({
              search: {},
            })
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
