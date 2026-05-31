package Alex.D.dev.repository;

import Alex.D.dev.entity.User;
import Alex.D.dev.entity.VerificationCode;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {

    @Modifying
    @Transactional
    void deleteByUser(User user);

    Optional<VerificationCode> findByCodeAndUser(String code, User user);
}
