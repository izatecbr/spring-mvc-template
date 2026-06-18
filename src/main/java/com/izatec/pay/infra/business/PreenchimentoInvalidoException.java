package com.izatec.pay.infra.business;

public class PreenchimentoInvalidoException extends BusinessException{
    public PreenchimentoInvalidoException(String campo, String validacao){
        this(campo,validacao, "O campo precisa ser preenchido conforme regra(s) de negócio");
    }
    public PreenchimentoInvalidoException(String campo, String validacao, String sugestao){
        super(campo,validacao,sugestao);
    }
}
