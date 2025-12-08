import privateAxios from "@/lib/axios/privateAxios"
import { IBackendRes } from "@/types/backend.type"

interface IChartRes {
  result: { name: string, value: number }[]
}

const ChartService = {
  getDataGenre: (): Promise<IBackendRes<IChartRes>> => {
    return privateAxios.get("films/chart/genre")
  },
  getDataCommon: (type: string): Promise<IBackendRes<IChartRes>> => {
    return privateAxios.get("films/chart/allcode", {
      params: {
        type: type
      }
    })
  }
}

export default ChartService
