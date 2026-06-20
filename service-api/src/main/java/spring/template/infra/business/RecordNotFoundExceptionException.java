package spring.template.infra.business;


import spring.template.infra.Atributos;
import spring.template.infra.Entidades;

public class RecordNotFoundExceptionException extends BusinessException {
    public RecordNotFoundExceptionException(Entidades registro, Atributos campo, Object valor) {
        super(BusinessMessage.E404,registro.getLegenda(),campo.getLegenda(), valor.toString());
    }
    public RecordNotFoundExceptionException(Entidades registro, Object valor) {
        super(BusinessMessage.E404,registro.getLegenda(),Atributos.ID, valor);
    }
    public RecordNotFoundExceptionException(Entidades registro) {
        super(BusinessMessage.E404,registro.getLegenda(),"Identificação");
    }
    public RecordNotFoundExceptionException() {
        super(BusinessMessage.E404,"Registro", "Parâmetro","Valor informado");
    }

}
