package spring.template.infra.business;

import org.springframework.http.HttpStatus;

public enum BusinessMessage {
    E404("404", "Não existe um registro de %s com o %s: %s informado","O registro deve existir previamente"){
        @Override
        public int getHttpStatus() {
            return HttpStatus.NOT_FOUND.value();
        }
    },
    E204("204", "Consulta sem registros","Realize uma operação de cadastro"){
        @Override
        public int getHttpStatus() {
            return HttpStatus.NO_CONTENT.value();
        }
    },
    E501("501", "Erro ao tentar acessar o recurso","Contacte o Suporte Técnico"){

        @Override
        public int getHttpStatus() {
            return 500;
        }
    },
    E502("502", "Método não implementado","Contacte o Suporte Técnico"){
        @Override
        public int getHttpStatus() {
            return 500;
        }
    },
    E500("500", "Erro não mapeado","Contacte o Suporte Técnico"){

        @Override
        public int getHttpStatus() {
            return 500;
        }
    },
    E01("01", "O campo: %s é obrigatório","Preencha o campo e tente novamente"),

    E99("99", "O campo %s %s","%s"),
    ;
    private final String code;
    private final String message;
    private final String suggestion;

    private int httpStatus;

    private BusinessMessage(String code, String mensagem, String suggestion) {
        this.code = code;
        this.message = mensagem;
        this.suggestion = suggestion;
    }

    public int getHttpStatus() {
        return HttpStatus.CONFLICT.value();
    }

    public String getSuggestion() {
        return suggestion;
    }

    public String getCode() {
        return code;
    }
    public String getMessage() {
        return message;
    }

}
