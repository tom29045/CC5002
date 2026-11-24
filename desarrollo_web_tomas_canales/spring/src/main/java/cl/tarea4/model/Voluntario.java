package cl.tarea4.model;

import jakarta.persistence.*;

@Entity
@Table(name = "voluntario")
public class Voluntario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre")
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comuna_id")
    private Comuna comuna;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
    public Comuna getComuna() { return comuna; }
}