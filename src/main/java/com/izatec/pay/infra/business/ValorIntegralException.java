package com.izatec.pay.infra.business;


import static com.izatec.pay.infra.business.BusinessMessage.E141;

public class ValorIntegralException extends BusinessException {
    public ValorIntegralException() {
        super(E141);
    }
}
