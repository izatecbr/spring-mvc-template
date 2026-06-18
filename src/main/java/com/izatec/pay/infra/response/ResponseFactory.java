package com.izatec.pay.infra.response;

import com.izatec.pay.infra.Atributos;
import com.izatec.pay.infra.Entidades;
import com.izatec.pay.infra.business.BusinessException;
import com.izatec.pay.infra.business.ConsultaSemRegistrosException;
import com.izatec.pay.infra.business.RegistroNaoLocalizadoException;
import org.springframework.http.HttpStatus;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

public class ResponseFactory {
    public static Response okOrNotFound(Object value) {
        return okOrNotFound(value, "Registro localizado com sucesso");
    }
    public static Response optional(Optional optional, Entidades registro, Atributos campo, Object valor) {
        if(optional.isPresent())
            return ok(optional.get(),"Registro localizado com sucesso");
        else
            throw new RegistroNaoLocalizadoException(registro,campo,valor);
    }
    public static Response okOrNotFound(Object value, String message) {
        RegistroNaoLocalizadoException exception = new RegistroNaoLocalizadoException();
        Optional.ofNullable(value).orElseThrow(() -> exception );
        return ok(value,message) ;
    }
    public static Response okOrNoContent(Object value) {
        ConsultaSemRegistrosException exception = new ConsultaSemRegistrosException();
        if (value == null) {
            throw exception;
        }
        String msg = "Consulta realizada com sucesso";

        if (value instanceof Collection<?> collection) {
            if (collection.isEmpty()) {
                return noContent();
                //throw exception;
            }
            return ok(collection, msg);
        }
        return null;
    }


    public static Response ok(Object body) {
        return ok(body,"Consulta realizada com sucesso");
    }
    public static Response ok(Object body, String message) {
        return response(HttpStatus.OK.value(), body,message);
    }
    public static Response noContent() {
        return response(HttpStatus.NO_CONTENT.value(), new ArrayList<>(),"Consulta sem registros");
    }
    public static Response create(Object body, String message) {
        return response(HttpStatus.CREATED.value(), body,message);
    }
    private static Response response(Serializable code, Object body, String message) {
        return define(code,body,message,"",true);
    }

    public static Response error() {
        return error("Error","Contacte o Suporte Técnico");
    }
    public static Response exception(BusinessException be) {
        return error(be.getErrorCode(), be.getMessage(),be.getSuggestion());
    }
    public static Response error(String message, String suggestion) {
        return error(500,message,suggestion);
    }
    public static Response error(Serializable code,String message, String suggestion){
        return define(code,null, message, suggestion, false);
    }
    public static Response success(Serializable code,Object body, String message){
        return define(code,body, message, "suggestion", true);
    }

    private static Response define(Serializable code,Object body, String message, String suggestion, boolean success){
        Response response = new Response();
        ResponseStatus status = new ResponseStatus();
        status.code =code;
        status.message = message;
        status.suggestion = suggestion;
        status.success = success;
        response.setStatus(status);
        /*if(body instanceof Page){
            Page page = (Page) body;
            ResponsePage responsePage = new ResponsePage();
            responsePage.setPageNumber(page.getPageable().getPageNumber());
            responsePage.setPageSize(page.getPageable().getPageSize());
            responsePage.setFirst(page.isFirst());
            responsePage.setTotalPages(page.getTotalPages());
            responsePage.setTotalElements(page.getTotalElements());
            responsePage.setNumberOfElements(page.getNumberOfElements());
            responsePage.setSize(page.getSize());
            response.setPage(responsePage);
            response.setBody(page.getContent());
        }else*/
            response.setBody(body);
        return response;
    }
}