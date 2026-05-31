package Alex.D.dev.controller;

import Alex.D.dev.entity.TimeEntry;
import Alex.D.dev.repository.TimeEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final TimeEntryRepository timeEntryRepository;

    @GetMapping("/me")
    public ResponseEntity<ByteArrayResource> exportMyData(
            @RequestHeader("User-Email") String email,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<TimeEntry> entries;
        if (startDate != null && endDate != null) {
            entries = timeEntryRepository.findByAttendanceUserEmailAndDateBetween(
                    email, LocalDate.parse(startDate), LocalDate.parse(endDate));
        } else {
            entries = timeEntryRepository.findByAttendanceUserEmail(email);
        }
        return buildCsvResponse(entries, "my_activities.csv");
    }

    @GetMapping("/all")
    public ResponseEntity<ByteArrayResource> exportAllData(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<TimeEntry> entries;
        if (startDate != null && endDate != null) {
            entries = timeEntryRepository.findAllByDateBetween(LocalDate.parse(startDate), LocalDate.parse(endDate));
        } else {
            entries = timeEntryRepository.findAll();
        }
        return buildCsvResponse(entries, "all_users_activities.csv");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ByteArrayResource> exportUserData(
            @PathVariable Long userId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<TimeEntry> entries;
        if (startDate != null && endDate != null) {
            entries = timeEntryRepository.findByAttendanceUserIdAndDateBetween(
                    userId, LocalDate.parse(startDate), LocalDate.parse(endDate));
        } else {
            entries = timeEntryRepository.findByAttendanceUserId(userId);
        }
        return buildCsvResponse(entries, "user_" + userId + "_activities.csv");
    }

    private ResponseEntity<ByteArrayResource> buildCsvResponse(List<TimeEntry> entries, String filename) {
        StringBuilder csv = new StringBuilder();
        csv.append("Email;Дата;Тип;Активность;Длительность (мин);Описание\n");

        for (TimeEntry entry : entries) {
            String userEmail = entry.getAttendance().getUser().getEmail();
            String date = entry.getDate().toString();
            String type = entry.getAssignment() != null && entry.getAssignment().getType() != null ? entry.getAssignment().getType().name() : "";
            String activity = entry.getAssignment() != null ? entry.getAssignment().getName() : "";
            int duration = entry.getWorkedMinutes();
            String desc = entry.getDescription() != null ? entry.getDescription().replace("\n", " ").replace(";", ",") : "";

            csv.append(String.format("%s;%s;%s;%s;%d;%s\n", userEmail, date, type, activity, duration, desc));
        }

        byte[] bytes = csv.toString().getBytes(StandardCharsets.UTF_8);
        byte[] bom = new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};
        byte[] finalBytes = new byte[bom.length + bytes.length];
        System.arraycopy(bom, 0, finalBytes, 0, bom.length);
        System.arraycopy(bytes, 0, finalBytes, bom.length, bytes.length);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
                .body(new ByteArrayResource(finalBytes));
    }
}