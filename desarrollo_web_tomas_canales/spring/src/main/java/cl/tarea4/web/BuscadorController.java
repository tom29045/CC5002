package cl.tarea4.web;

import cl.tarea4.model.Avistamiento;
import cl.tarea4.model.Nota;
import cl.tarea4.repo.AvistamientoRepository;
import cl.tarea4.repo.NotaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BuscadorController {

    private static final DateTimeFormatter FECHA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final AvistamientoRepository avistamientos;
    private final NotaRepository notas;

    public BuscadorController(AvistamientoRepository avistamientos, NotaRepository notas) {
        this.avistamientos = avistamientos;
        this.notas = notas;
    }

    public record Resultado(Integer id, String voluntario, String dia,
                            String ave, String comuna, Double promedio) {}

    @GetMapping("/buscar")
    public List<Resultado> buscar(@RequestParam(defaultValue = "") String q) {
        String texto = q.trim();
        if (texto.isEmpty()) {
            return List.of();
        }
        return avistamientos.buscar(texto).stream()
                .map(a -> new Resultado(
                        a.getId(),
                        a.getVoluntario().getNombre(),
                        a.getFechaHora().format(FECHA),
                        a.getAve().getNombre(),
                        a.getVoluntario().getComuna().getNombre(),
                        notas.promedio(a.getId())))
                .toList();
    }

    @PostMapping("/avistamientos/{id}/nota")
    public ResponseEntity<?> evaluar(@PathVariable Integer id,
                                     @RequestBody Map<String, Object> body) {
        // Solo se acepta un entero JSON entre 1 y 7 (5.0, "5" o null se rechazan)
        Object raw = body.get("nota");
        if (!(raw instanceof Integer valor) || valor < 1 || valor > 7) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "La nota debe ser un entero entre 1 y 7"));
        }
        Avistamiento a = avistamientos.findById(id).orElse(null);
        if (a == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Avistamiento no existe"));
        }
        notas.save(new Nota(valor, a));
        return ResponseEntity.ok(Map.of("promedio", notas.promedio(id)));
    }
}