package spring.template.infra.business;


import spring.template.infra.Atributos;
import spring.template.infra.Entidades;

public class RecordNotFoundExceptionException extends BusinessException {
    public RecordNotFoundExceptionException(String entidade, String campo, Object valor) {
        super(BusinessMessage.E404,entidade,campo, valor.toString());
    }
    public RecordNotFoundExceptionException(String entidade, Object valor) {
        super(BusinessMessage.E404, entidade, Atributos.ID.getLegenda(), valor.toString());
    }
    
    public RecordNotFoundExceptionException() {
        super(BusinessMessage.E404,"entidade", "Parâmetro","Valor informado");
    }

}
