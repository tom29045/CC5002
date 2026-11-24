package cl.tarea4.model;

import jakarta.persistence.*;

@Entity
@Table(name = "comuna")
public class Comuna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre")
    private String nombre;

    public Integer getId() { return id; }
    public String getNombre() { return nombre; }
}