export interface IPlan {
    planId: number;
    planName: string;
    price: string;
    planDuration: number;
    isActive: boolean;
    durationInfo: {
        keyMap: string;
        type: string;
        valueEn: string;
        valueVi: string;
    }
}


export interface IPlanList {
    plans: IPlan[];
}