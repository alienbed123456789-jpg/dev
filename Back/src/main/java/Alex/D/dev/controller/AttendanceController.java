package Alex.D.dev.controller;

import Alex.D.dev.entity.Assignment;
import Alex.D.dev.entity.Attendance;
import Alex.D.dev.entity.TimeEntry;
import Alex.D.dev.entity.User;
import Alex.D.dev.repository.AssignmentRepository;
import Alex.D.dev.repository.TimeEntryRepository;
import Alex.D.dev.repository.UserRepository;
import Alex.D.dev.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired private AttendanceService attendanceService;
    @Autowired private UserRepository userRepository;
    @Autowired private AssignmentRepository assignmentRepository;
    @Autowired private TimeEntryRepository timeEntryRepository;

    @GetMapping("/{year}/{month}")
    public ResponseEntity<?> getMonthData(@PathVariable int year, @PathVariable int month, @RequestHeader("User-Email") String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<TimeEntry> entries = timeEntryRepository.findAllByAttendanceUserAndAttendanceYearAndAttendanceMonth(user, year, month);

        Map<Integer, List<Map<String, Object>>> dailyEntries = entries.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDate().getDayOfMonth(),
                        Collectors.mapping(e -> {
                            Map<String, Object> map = new java.util.HashMap<>();
                            map.put("id", e.getId());
                            map.put("assignmentName", e.getAssignment().getName());
                            map.put("workedMinutes", e.getWorkedMinutes());
                            map.put("description", e.getDescription());
                            return map;
                        }, Collectors.toList())
                ));
        return ResponseEntity.ok(dailyEntries);
    }

    @PostMapping("/entry")
    public ResponseEntity<?> addEntry(@RequestBody EntryRequest req, @RequestHeader("User-Email") String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        LocalDate date = LocalDate.parse(req.getDate());
        Attendance attendance = attendanceService.getOrCreateAttendance(user, date.getYear(), date.getMonthValue());
        Assignment assignment = assignmentRepository.findById(req.getAssignmentId()).orElseThrow();

        TimeEntry entry = new TimeEntry();
        entry.setAttendance(attendance);
        entry.setAssignment(assignment);
        entry.setDate(date);
        entry.setWorkedMinutes(req.getWorkedMinutes());
        entry.setDescription(req.getDescription());

        timeEntryRepository.save(entry);
        return ResponseEntity.ok("Data saved successfully!");
    }

    @DeleteMapping("/entry/{id}")
    public ResponseEntity<?> deleteEntry(@PathVariable Long id, @RequestHeader("User-Email") String email) {
        TimeEntry entry = timeEntryRepository.findById(id).orElseThrow(() -> new RuntimeException("Data not found"));
        if (!entry.getAttendance().getUser().getEmail().equals(email)) {
            return ResponseEntity.status(403).body("No permission to delete");
        }
        timeEntryRepository.delete(entry);
        return ResponseEntity.ok("Data deleted");
    }
}