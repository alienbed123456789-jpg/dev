package Alex.D.dev.repository;

import Alex.D.dev.entity.TimeEntry;
import Alex.D.dev.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByAttendanceId(Long attendanceId);
    List<TimeEntry> findAllByAttendanceUser(User user);
    List<TimeEntry> findAllByAttendanceUserAndAttendanceYearAndAttendanceMonth(User user, int year, int month);
    List<TimeEntry> findByAttendanceUserEmail(String email);
    List<TimeEntry> findByAttendanceUserEmailAndDateBetween(String email, LocalDate startDate, LocalDate endDate);
    List<TimeEntry> findAllByDateBetween(LocalDate startDate, LocalDate endDate);
    List<TimeEntry> findByAttendanceUserId(Long userId);
    List<TimeEntry> findByAttendanceUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}