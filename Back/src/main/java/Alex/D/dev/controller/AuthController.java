package Alex.D.dev.controller;

import Alex.D.dev.dto.LoginRequest;
import Alex.D.dev.dto.RegisterRequest;
import Alex.D.dev.dto.VerifyRequest;
import Alex.D.dev.entity.Assignment;
import Alex.D.dev.entity.User;
import Alex.D.dev.repository.AssignmentRepository;
import Alex.D.dev.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        authService.register(request.getEmail(), request.getPassword());
        return ResponseEntity.ok("Verification code sent to email!");
    }
    @PostMapping("/verify")
    public ResponseEntity<String> verify(@RequestBody VerifyRequest request) {
        boolean isVerified = authService.verifyCode(request.getEmail(), request.getCode());
        if (isVerified) {
            return ResponseEntity.ok("Account successfully verified!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid code or it has expired");
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("User-Email") String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(Map.of("role", user.getRule().name()));
    }
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        try {
            String message = authService.login(request.getEmail(), request.getPassword());
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
    @PostMapping("/login/step1")
    public ResponseEntity<String> loginStep1(@RequestBody LoginRequest request) {
        String message = authService.initiateLogin(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(message);
    }

    @PostMapping("/login/step2")
    public ResponseEntity<String> loginStep2(@RequestBody VerifyRequest request) {
        boolean isVerified = authService.verifyCode(request.getEmail(), request.getCode());
        if (isVerified) {
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid code");
        }
    }
    @Autowired
    private AssignmentRepository assignmentRepository;
    @Autowired
    private Alex.D.dev.repository.UserRepository userRepository;
    @GetMapping("/assignments")
    public ResponseEntity<List<Assignment>> getAllAssignments(@RequestHeader("User-Email") String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(assignmentRepository.findByUserOrUserIsNull(user));
    }

    @PostMapping("/assignments")
    public ResponseEntity<Assignment> createAssignment(
            @RequestBody java.util.Map<String, String> request,
            @RequestHeader("User-Email") String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Assignment assignment = new Assignment();
        assignment.setName(request.get("name"));

        String safeName = request.get("name").toUpperCase().replaceAll("[^A-ZА-Я0-9]", "");
        assignment.setCode(safeName + "_" + (int)(Math.random() * 10000));
        assignment.setType(Alex.D.dev.entity.AssignmentType.valueOf(request.getOrDefault("type", "WORK")));

        assignment.setUser(user);

        return ResponseEntity.ok(assignmentRepository.save(assignment));
    }

    @PostMapping("/request-password-change")
    public ResponseEntity<String> requestPasswordChange(@RequestHeader("User-Email") String email) {
        authService.requestPasswordChangeCode(email);
        return ResponseEntity.ok("Code sent to email");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest req, @RequestHeader("User-Email") String email) {
        try {
            authService.changePasswordWithCode(email, req.getCode(), req.getNewPassword());
            return ResponseEntity.ok("Password changed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

@lombok.Data
class ChangePasswordRequest {
    private String code;
    private String newPassword;
}

