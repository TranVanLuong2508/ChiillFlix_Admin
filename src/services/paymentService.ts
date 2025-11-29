import privateAxios from "@/lib/axios/privateAxios";
import { IBackendRes } from "@/types/backend.type";
import { IPaymentReturn } from "@/types/payment.type";

const PaymentService = {
  CallGetPaymentList: (): Promise<IBackendRes<IPaymentReturn>> => {
    return privateAxios.get("/payments");
  },
};

export default PaymentService;
