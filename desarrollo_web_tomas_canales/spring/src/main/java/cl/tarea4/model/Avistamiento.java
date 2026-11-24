package cl.tarea4.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "avistamiento")
public class Avistamiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voluntario_id")
    private Voluntario voluntario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ave_id")
    private Ave ave;

    public Integer getId() { return id; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public Voluntario getVoluntario() { return voluntario; }
    public Ave getAve() { return ave; }
}