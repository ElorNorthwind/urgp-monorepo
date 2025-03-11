import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { SessionCard, useGetUserSessions } from '@urgp/client/entities';
import { Separator, useIsMobile } from '@urgp/client/shared';
import { AddressUploadPageSearchDto } from '@urgp/shared/entities';
import { useState } from 'react';

const AddressMySessionsPage = (): JSX.Element => {
  const { data: sessions, isLoading, isFetching } = useGetUserSessions();

  return (
    <div className="block space-y-6 p-10 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex w-full flex-row justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Мои запросы</h2>
            <span>Ранее сформированные мною запросы</span>
          </div>
        </div>
        <Separator className="my-6" />

        <div className="flex flex-col gap-4">
          {sessions &&
            sessions.length > 0 &&
            sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                className="w-full"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AddressMySessionsPage;
