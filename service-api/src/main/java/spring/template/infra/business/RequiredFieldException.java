package spring.template.infra.business;

public class RequiredFieldException extends BusinessException {
    public RequiredFieldException(String field) {
        super(BusinessMessage.E01,field);
    }
}
