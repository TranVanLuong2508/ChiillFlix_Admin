import { create } from "zustand"
import { producerService } from "@/services/producerService"
import type { ProducerColumn } from "@/types/producer.type"
import type { CreateProducerDto, UpdateProducerDto } from "@/types/producer.type"

interface ProducerState {
    producers: ProducerColumn[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    } | null
    loading: boolean
    error: string | null
}

interface ProducerActions {
    fetchProducers: (page?: number, limit?: number, sort?: string, filter?: Record<string, any>) => Promise<void>
    createProducer: (dto: CreateProducerDto) => Promise<boolean>
    updateProducer: (producerId: number, dto: UpdateProducerDto) => Promise<boolean>
    deleteProducer: (producerId: number) => Promise<boolean>
    clearError: () => void
}

export const useProducerStore = create<ProducerState & ProducerActions>((set, get) => ({
    producers: [],
    meta: null,
    loading: false,
    error: null,

    fetchProducers: async (page = 1, limit = 10, sort?: string, filter?: Record<string, any>) => {
        set({ loading: true, error: null })
        try {
            const res = await producerService.getAllProducers(page, limit, sort, filter)
            if (res.EC === 1 && res.data) {
                const producers = res.data.producers.map((item) => ({
                    producerId: item.producerId.toString(),
                    producerName: item.producerName,
                    slug: item.slug,
                }))

                set({
                    producers,
                    meta: res.data.meta,
                    loading: false,
                })
            } else {
                console.error("Failed to fetch producers:", res)
                set({
                    error: res.EM || "Failed to fetch producers",
                    loading: false,
                })
            }
        } catch (error) {
            console.error("Error fetching producers:", error)
            set({
                error: error instanceof Error ? error.message : "An error occurred",
                loading: false,
            })
        }
    },

    createProducer: async (dto: CreateProducerDto) => {
        set({ loading: true, error: null })
        try {
            const res = await producerService.createProducer(dto)
            if (res.EC === 1) {
                await get().fetchProducers(get().meta?.page || 1, get().meta?.limit || 10)
                set({ loading: false })
                return true
            } else {
                set({ error: res.EM || "Failed to create producer", loading: false })
                return false
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "An error occurred",
                loading: false,
            })
            return false
        }
    },

    updateProducer: async (producerId: number, dto: UpdateProducerDto) => {
        set({ loading: true, error: null })
        try {
            const res = await producerService.updateProducer(producerId, dto)
            if (res.EC === 1) {
                await get().fetchProducers(get().meta?.page || 1, get().meta?.limit || 10)
                set({ loading: false })
                return true
            } else {
                set({ error: res.EM || "Failed to update producer", loading: false })
                return false
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "An error occurred",
                loading: false,
            })
            return false
        }
    },

    deleteProducer: async (producerId: number) => {
        set({ loading: true, error: null })
        try {
            const res = await producerService.deleteProducer(producerId)
            if (res.EC === 1) {
                await get().fetchProducers(get().meta?.page || 1, get().meta?.limit || 10)
                set({ loading: false })
                return true
            } else {
                set({ error: res.EM || "Failed to delete producer", loading: false })
                return false
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "An error occurred",
                loading: false,
            })
            return false
        }
    },

    clearError: () => set({ error: null }),
}))
