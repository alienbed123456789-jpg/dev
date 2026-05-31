package Alex.D.dev.service;

import Alex.D.dev.entity.User;
import Alex.D.dev.entity.VerificationCode;
import Alex.D.dev.repository.UserRepository;
import Alex.D.dev.repository.VerificationCodeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationCodeRepository codeRepository;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EntityManager entityManager;

    @Transactional
    public void register(String email, String password) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(false);
        userRepository.save(user);

        String code = String.format("%06d", new Random().nextInt(999999));

        codeRepository.deleteByUser(user);
        entityManager.flush();

        VerificationCode verificationCode = new VerificationCode(code, user);
        codeRepository.save(verificationCode);

        try {
            emailService.sendVerificationEmail(email, code);
        } catch (Exception e) {
            System.err.println("EMAIL NOT SENT: " + e.getMessage());
        }
        System.out.println("DEBUG: Registration code (" + email + ") -> " + code);
    }

    @Transactional
    public boolean verifyCode(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<VerificationCode> verificationCodeOpt = codeRepository.findByCodeAndUser(code, user);

        if (verificationCodeOpt.isPresent()) {
            VerificationCode verificationCode = verificationCodeOpt.get();
            if (verificationCode.getExpiryDate().isAfter(LocalDateTime.now())) {
                user.setEnabled(true);
                userRepository.save(user);
                codeRepository.delete(verificationCode);
                return true;
            }
        }
        return false;
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        if (!user.isEnabled()) {
            throw new RuntimeException("Account not confirmed. Check email!");
        }
        return "Successful login!";
    }

    @Transactional
    public String initiateLogin(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not registered"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String code = String.format("%06d", new Random().nextInt(999999));

        codeRepository.deleteByUser(user);
        entityManager.flush();

        VerificationCode verificationCode = new VerificationCode(code, user);
        codeRepository.save(verificationCode);

        try {
            emailService.sendVerificationEmail(email, code);
        } catch (Exception e) {
            System.err.println("EMAIL NOT SENT: " + e.getMessage());
        }
        System.out.println("DEBUG: Login code (" + email + ") -> " + code);
        return "Code sent";
    }

    @Transactional
    public void requestPasswordChangeCode(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String code = String.format("%06d", new Random().nextInt(999999));

        codeRepository.deleteByUser(user);
        entityManager.flush();

        VerificationCode verificationCode = new VerificationCode(code, user);
        codeRepository.save(verificationCode);

        try {
            emailService.sendVerificationEmail(email, code);
        } catch (Exception e) {
            System.err.println("EMAIL NOT SENT: " + e.getMessage());
        }
        System.out.println("DEBUG: Password change code -> " + code);
    }

    @Transactional
    public void changePasswordWithCode(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VerificationCode verificationCode = codeRepository.findByCodeAndUser(code, user)
                .orElseThrow(() -> new RuntimeException("Invalid verification code"));

        if (verificationCode.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Code expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        codeRepository.delete(verificationCode);
    }
}