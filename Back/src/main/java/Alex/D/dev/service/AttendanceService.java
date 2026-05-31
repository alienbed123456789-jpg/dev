package Alex.D.dev.service;

import Alex.D.dev.entity.Attendance;
import Alex.D.dev.entity.TimeEntry;
import Alex.D.dev.entity.User;
import Alex.D.dev.repository.AttendanceRepository;
import Alex.D.dev.repository.TimeEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private TimeEntryRepository timeEntryRepository;

    public Attendance getOrCreateAttendance(User user, int year, int month) {
        return attendanceRepository.findByUserAndYearAndMonth(user, year, month)
                .orElseGet(() -> {
                    Attendance newAttendance = new Attendance();
                    newAttendance.setUser(user);
                    newAttendance.setYear(year);
                    newAttendance.setMonth(month);
                    return attendanceRepository.save(newAttendance);
                });
    }

    public List<TimeEntry> getTimeEntries(Long attendanceId) {
        return timeEntryRepository.findByAttendanceId(attendanceId);
    }
}
