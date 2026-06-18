package com.izatec.pay.infra.business;

public class RegistroIncompativelException extends BusinessException{
    public RegistroIncompativelException(String descricao){
        super(BusinessMessage.E127,descricao);
    }

}

