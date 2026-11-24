package cl.tarea4.repo;

import cl.tarea4.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {

    // null si el avistamiento no tiene notas
    @Query("select avg(n.valor) from Nota n where n.avistamiento.id = :id")
    Double promedio(@Param("id") Integer avistamientoId);
}