package spring.template.app;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.template.infra.response.Response;
import spring.template.infra.response.ResponseFactory;

@RestController
@RequestMapping("/api/models")
@RequiredArgsConstructor
public class AppController {

    private final AppService service;

    @PostMapping
    public ResponseEntity<Response> create(@RequestBody Model model) {
        Model created = service.create(model);
        return ResponseEntity.status(201).body(ResponseFactory.create(created, "Registro criado com sucesso"));
    }
}
