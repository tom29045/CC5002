package cl.tarea4.model;

import jakarta.persistence.*;

@Entity
@Table(name = "nota")
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nota")
    private Integer valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avistamiento_id")
    private Avistamiento avistamiento;

    public Nota() {}

    public Nota(Integer valor, Avistamiento avistamiento) {
        this.valor = valor;
        this.avistamiento = avistamiento;
    }

    public Integer getId() { return id; }
    public Integer getValor() { return valor; }
    public Avistamiento getAvistamiento() { return avistamiento; }
}