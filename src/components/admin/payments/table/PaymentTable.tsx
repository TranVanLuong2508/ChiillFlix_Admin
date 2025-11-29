"use client";

import PaymentService from "@/services/paymentService";
import { IPayment } from "@/types/payment.type";
import { useEffect, useState } from "react";

export const PaymentTable = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const res = await PaymentService.CallGetPaymentList();

      if (res && res.EC === 1) {
        setPayments(res.data?.payments ?? []);
      }
    } catch (error) {
      console.log("Error from fetch payment data <<PayementTable>>: ", error);
    }
  };

  console.log("Check payment data: ", payments);
  return <>Payment table</>;
};
