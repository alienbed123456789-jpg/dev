package Alex.D.dev.entity;

import jakarta.persistence.*;
import lombok.Data;

import static Alex.D.dev.entity.Rules.USER;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rules rule = USER;

    @Column(nullable = false)
    private String password;

    private boolean isEnabled = false;
}
