package spring.template.infra.business;

import static spring.template.infra.business.BusinessMessage.E204;

public class NoResultsFoundException extends BusinessException {
    public NoResultsFoundException() {
        super(E204);
    }
}
