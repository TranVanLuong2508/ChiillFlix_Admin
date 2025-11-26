"use client";

import { IEpisodeDetail } from "@/types/episode.type";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface EpisodeSectionProps {
  partId: string;
  episodes: IEpisodeDetail[];
}

export const EpisodeMain = ({
  partId,
  episodes
}: EpisodeSectionProps) => {
  // const { isLoadingDelete } = useFilmStore();


  const [episodeData, setEpisodeData] = useState<IEpisodeDetail[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });


  // useEffect(() => {
  //   if (isLoadingDelete) return;

  //   getFilmPagination()
  // }, [pagination.pageIndex, pagination.pageSize, isLoadingDelete]);


  return (
    <div>
      <DataTable
        columns={columns}
        data={episodeData}
        hiddenColumns={['id', 'videoUrl', 'thumbUrl']}
        pagination={pagination}
        pageCount={pageCount}
        setPagination={setPagination}
      />
    </div>
  )
}