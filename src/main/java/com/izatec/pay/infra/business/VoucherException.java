package com.izatec.pay.infra.business;


import static com.izatec.pay.infra.business.BusinessMessage.E182;

public class VoucherException extends BusinessException {
    public VoucherException(String mensagem) {
        super(E182, mensagem);
    }
}
