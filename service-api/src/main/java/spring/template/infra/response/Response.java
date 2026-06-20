package spring.template.infra.response;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class Response {
	//private ResponseStatus status;
	LocalDate dia = LocalDate.now();
	LocalTime hora = LocalTime.now();
	boolean success;
	String mensagem;
	Serializable codigo;
	String sugestao;
	private Object data;
	private ResponsePage page;
}
