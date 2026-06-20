package spring.template.infra.response;

import spring.template.infra.business.BusinessException;
import spring.template.infra.business.NoResultsFoundException;
import spring.template.infra.business.RecordNotFoundExceptionException;
import org.springframework.http.HttpStatus;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

public class ResponseFactory {

    public static Response okOrNotFound(Object value) {
        return okOrNotFound(value, "Registro localizado com sucesso");
    }

    public static Response okOrNotFound(Object value, String message) {
        Optional.ofNullable(value).orElseThrow(RecordNotFoundExceptionException::new);
        return ok(value, message);
    }

    public static Response okOrNoContent(Object value) {
        if (value == null) {
            throw new NoResultsFoundException();
        }
        String msg = "Consulta realizada com sucesso";
        if (value instanceof Collection<?> collection) {
            if (collection.isEmpty()) {
                return noContent();
            }
            return ok(collection, msg);
        }
        return null;
    }

    public static Response ok(Object body) {
        return ok(body, "Consulta realizada com sucesso");
    }

    public static Response ok(Object body, String message) {
        return response(HttpStatus.OK.value(), body, message);
    }

    public static Response noContent() {
        return response(HttpStatus.NO_CONTENT.value(), new ArrayList<>(), "Consulta sem registros");
    }

    public static Response create(Object body, String message) {
        return response(HttpStatus.CREATED.value(), body, message);
    }

    private static Response response(Serializable code, Object body, String message) {
        return define(code, body, message, "", true);
    }

    public static Response error() {
        return error("Error", "Contacte o Suporte Técnico");
    }

    public static Response exception(BusinessException be) {
        return error(be.getErrorCode(), be.getMessage(), be.getSuggestion());
    }

    public static Response error(String message, String suggestion) {
        return error(500, message, suggestion);
    }

    public static Response error(Serializable code, String message, String suggestion) {
        return define(code, null, message, suggestion, false);
    }

    public static Response success(Serializable code, Object body, String message) {
        return define(code, body, message, "", true);
    }

    private static Response define(Serializable code, Object body, String message, String suggestion, boolean success) {
        Response response = new Response();
        response.codigo = code;
        response.mensagem = message;
        response.sugestao = suggestion;
        response.success = success;
        response.setData(body);
        return response;
    }
}
