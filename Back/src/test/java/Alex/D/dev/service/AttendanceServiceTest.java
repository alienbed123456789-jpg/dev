package Alex.D.dev.service;

import Alex.D.dev.entity.Attendance;
import Alex.D.dev.entity.TimeEntry;
import Alex.D.dev.entity.User;
import Alex.D.dev.repository.AttendanceRepository;
import Alex.D.dev.repository.TimeEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;

    @Mock
    private TimeEntryRepository timeEntryRepository;

    @InjectMocks
    private AttendanceService attendanceService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@test.com");
    }

    @Test
    void getOrCreateAttendance_whenRecordExists_returnsRecord() {
        Attendance existing = new Attendance();
        existing.setId(10L);
        when(attendanceRepository.findByUserAndYearAndMonth(testUser, 2026, 5))
                .thenReturn(Optional.of(existing));

        Attendance result = attendanceService.getOrCreateAttendance(testUser, 2026, 5);

        assertEquals(10L, result.getId());
        verify(attendanceRepository, never()).save(any());
    }

    @Test
    void getOrCreateAttendance_whenRecordDoesNotExist_createsNew() {
        when(attendanceRepository.findByUserAndYearAndMonth(testUser, 2026, 5))
                .thenReturn(Optional.empty());

        Attendance saved = new Attendance();
        saved.setId(20L);
        saved.setYear(2026);
        saved.setMonth(5);
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(saved);

        Attendance result = attendanceService.getOrCreateAttendance(testUser, 2026, 5);

        assertEquals(20L, result.getId());
        assertEquals(2026, result.getYear());
        verify(attendanceRepository, times(1)).save(any(Attendance.class));
    }

    @Test
    void getTimeEntries_returnsListOfEntries() {
        TimeEntry entry = new TimeEntry();
        entry.setId(1L);
        when(timeEntryRepository.findByAttendanceId(10L)).thenReturn(List.of(entry));

        List<TimeEntry> results = attendanceService.getTimeEntries(10L);

        assertFalse(results.isEmpty());
        assertEquals(1L, results.get(0).getId());
    }
}