package spring.template.infra.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ResponseStatus {
    LocalDate data = LocalDate.now();
    LocalTime hora = LocalTime.now();
    boolean success;
    String mensagem;
    Serializable codigo;
    String sugestao;
}
