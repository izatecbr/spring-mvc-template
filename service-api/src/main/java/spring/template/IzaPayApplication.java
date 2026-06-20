package spring.template;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Locale;
import java.util.TimeZone;

@SpringBootApplication
public class IzaPayApplication {

	public static void main(String[] args) {
		Locale.setDefault(new Locale("pt", "BR"));
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
		SpringApplication.run(IzaPayApplication.class, args);
	}

}
