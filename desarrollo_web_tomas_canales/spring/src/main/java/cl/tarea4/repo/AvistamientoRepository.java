package cl.tarea4.repo;

import cl.tarea4.model.Avistamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AvistamientoRepository extends JpaRepository<Avistamiento, Integer> {

    @Query("""
        select a from Avistamiento a
        join fetch a.ave av
        join fetch a.voluntario v
        join fetch v.comuna c
        where lower(av.nombre) like lower(concat('%', :q, '%'))
           or lower(v.nombre)  like lower(concat('%', :q, '%'))
           or lower(c.nombre)  like lower(concat('%', :q, '%'))
        order by a.fechaHora desc
        """)
    List<Avistamiento> buscar(@Param("q") String q);
}