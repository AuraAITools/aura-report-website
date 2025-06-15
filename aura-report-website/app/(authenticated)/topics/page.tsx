"use client";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import TopicsFilterTable from "@/features/topics-dashboard/topics-filter-table/TopicsFilterTable";
import { TopicsApis } from "@/lib/hooks/topic-queries";

export default function TopicsPage() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const {
    error,
    data: topics = [],
    refetch,
  } = TopicsApis.useGetAllExpandedTopicsOfInstitution(currentInstitution?.id);

  if (error) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        Failed to fetch data, make a report to email@gmail.com with error code
      </div>
    );
  }

  return (
    <div>
      <TopicsFilterTable topics={topics} refetch={refetch} />
    </div>
  );
}
