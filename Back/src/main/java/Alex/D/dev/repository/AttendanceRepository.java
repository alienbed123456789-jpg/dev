package Alex.D.dev.repository;

import Alex.D.dev.entity.Attendance;
import Alex.D.dev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByUserAndYearAndMonth(User user, int year, int month);
}