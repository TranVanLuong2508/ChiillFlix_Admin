import publicAxios from "@/lib/axios/publicAxios"
import { IBackendRes } from "@/types/backend.type";
import { IProducer } from "@/types/producer.type";

const ProducerService = {
  getAllProducers: (): Promise<IBackendRes<IProducer[]>> => {
    return publicAxios.get("/producer/all");
  }
}

export default ProducerService