package com.izatec.pay.infra.business;


import static com.izatec.pay.infra.business.BusinessMessage.E140;

public class ValorParcialException extends BusinessException {
    public ValorParcialException() {
        super(E140);
    }
}
