package Alex.D.dev.repository;

import Alex.D.dev.entity.Assignment;
import Alex.D.dev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findByCode(String code);
    List<Assignment> findByUserOrUserIsNull(User user);
}