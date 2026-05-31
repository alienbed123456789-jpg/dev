package Alex.D.dev.controller;

import Alex.D.dev.entity.TimeEntry;
import Alex.D.dev.entity.User;
import Alex.D.dev.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import Alex.D.dev.repository.TimeEntryRepository;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final TimeEntryRepository timeEntryRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("User-Email") String email) {
        User admin = userRepository.findByEmail(email).orElseThrow();
        if (!admin.getRule().name().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userRepository.findAll());
    }
    @GetMapping("/users/{userId}/activities")
    public ResponseEntity<List<TimeEntry>> getUserActivities(@RequestHeader("User-Email") String email, @PathVariable Long userId) {
        User admin = userRepository.findByEmail(email).orElseThrow();
        if (!admin.getRule().name().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(timeEntryRepository.findAllByAttendanceUser(targetUser));
    }
}