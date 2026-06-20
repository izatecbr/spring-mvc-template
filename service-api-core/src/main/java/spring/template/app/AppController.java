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
        return ResponseEntity.status(201).body(ResponseFactory.create(service.create(model), "Registro criado com sucesso"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> update(@PathVariable Integer id, @RequestBody Model model) {
        return ResponseEntity.ok(ResponseFactory.ok(service.update(id, model), "Registro alterado com sucesso"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.ok(ResponseFactory.ok(null, "Registro removido com sucesso"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> get(@PathVariable Integer id) {
        return ResponseEntity.ok(ResponseFactory.ok(service.get(id)));
    }

    @GetMapping
    public ResponseEntity<Response> list() {
        return ResponseEntity.ok(ResponseFactory.okOrNoContent(service.list()));
    }

    @DeleteMapping
    public ResponseEntity<Response> clear() {
        service.clear();
        return ResponseEntity.ok(ResponseFactory.ok(true, "Registros removidos com sucesso"));
    }
}
