package spring.template.infra.business;

public class RecordNotFoundExceptionException extends BusinessException {
    public RecordNotFoundExceptionException(String entidade, String campo, Object valor) {
        super(BusinessMessage.E404, entidade, campo, valor.toString());
    }

    public RecordNotFoundExceptionException(String entidade, Object valor) {
        super(BusinessMessage.E404, entidade, "ID", valor.toString());
    }

    public RecordNotFoundExceptionException() {
        super(BusinessMessage.E404, "entidade", "Parâmetro", "Valor informado");
    }
}
