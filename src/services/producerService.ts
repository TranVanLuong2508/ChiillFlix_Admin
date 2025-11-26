import publicAxios from "@/lib/axios/publicAxios"
import privateAxios from "@/lib/axios/privateAxios"
import type { IBackendRes } from "@/types/backend.type"
import type { IProducerPagination, Producer } from "@/types/producer.type"
import type { CreateProducerDto } from "@/types/producer.type"
import type { UpdateProducerDto } from "@/types/producer.type"

export const producerService = {
    getAllProducers: (
        page = 1,
        limit = 10,
        sort?: string,
        filter?: Record<string, any>,
    ): Promise<IBackendRes<IProducerPagination>> => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("limit", limit.toString())

        if (sort) {
            params.append("sort", sort)
        }

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== "") {
                    params.append(key, value.toString())
                }
            })
        }

        return privateAxios.get(`/producer/get-all-producers?${params.toString()}`)
    },

    getProducerById: (producerId: number): Promise<IBackendRes<Producer>> => {
        return publicAxios.get(`/producer/get-producer-by-id/${producerId}`)
    },

    createProducer: (dto: CreateProducerDto): Promise<IBackendRes<Producer>> => {
        return privateAxios.post("/producer/create-producer", dto)
    },

    updateProducer: (producerId: number, dto: UpdateProducerDto): Promise<IBackendRes<Producer>> => {
        return privateAxios.patch(`/producer/edit-producer/${producerId}`, dto)
    },

    deleteProducer: (producerId: number, newProducerId?: number): Promise<IBackendRes<any>> => {
        let url = `/producer/delete-producer-by-id/${producerId}`
        if (newProducerId) {
            url += `?newProducerId=${newProducerId}`
        }
        return privateAxios.delete(url)
    },
}
