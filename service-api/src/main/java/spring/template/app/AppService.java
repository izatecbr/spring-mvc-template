package spring.template.app;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AppService {
    private Map<Integer, Model> models = new HashMap<>();

    @PostConstruct
    public void init() {
        Model model = new Model();
        model.setId(1);
        model.setName("Model 1");
        models.put(model.getId(), model);

        model = new Model();
        model.setId(2);
        model.setName("Model 2");
        models.put(model.getId(), model);

    }

    public Model create(Model model) {
        Integer id = models.size() + 1;
        model.setId(id);
        models.put(id, model);
        return model;
    }

    public Model update(Integer id, Model model) {
        if (models.containsKey(id)) {
            model.setId(id);
            models.put(id, model);
            return model;
        }
        return null;
    }

    public void delete(Integer id) {
        models.remove(id);
    }

    public Model get(Integer id) {
        return models.get(id);
    }

    public List<Model> list() {
        return new ArrayList<>(models.values());
    }
}
