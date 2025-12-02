import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IPlanList, IPlan } from "@/types/plan.type";

const PlansService = {
    getAllPlans: (): Promise<IBackendRes<IPlanList>> => {
        return privateAxios.get("/subscription-plans");
    },

    createPlan: (payload: any): Promise<IBackendRes<{ planId: number }>> => {
        return privateAxios.post("/subscription-plans", payload);
    },

    getPlanDetail: (planId: number): Promise<IBackendRes<IPlan>> => {
        return privateAxios.get(`/subscription-plans/${planId}`);
    },

    updatePlan: (planId: number, payload: any): Promise<IBackendRes<{ planId: number }>> => {
        return privateAxios.patch(`/subscription-plans/${planId}`, payload);
    }
}

export default PlansService;