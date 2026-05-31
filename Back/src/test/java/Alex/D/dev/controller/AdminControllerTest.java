package Alex.D.dev.controller;

import Alex.D.dev.entity.Rules;
import Alex.D.dev.entity.TimeEntry;
import Alex.D.dev.entity.User;
import Alex.D.dev.repository.TimeEntryRepository;
import Alex.D.dev.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TimeEntryRepository timeEntryRepository;

    @InjectMocks
    private AdminController adminController;

    private User adminUser;
    private User normalUser;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setEmail("admin@test.com");
        adminUser.setRule(Rules.ADMIN);

        normalUser = new User();
        normalUser.setEmail("user@test.com");
        normalUser.setRule(Rules.USER);
    }

    @Test
    void getAllUsers_ifAdmin_returnsOk() {
        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(adminUser));
        when(userRepository.findAll()).thenReturn(List.of(adminUser, normalUser));

        ResponseEntity<List<User>> response = adminController.getAllUsers("admin@test.com");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void getAllUsers_ifNotAdmin_returnsForbidden() {
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(normalUser));

        ResponseEntity<List<User>> response = adminController.getAllUsers("user@test.com");

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    void getUserActivities_ifAdmin_returnsOk() {
        normalUser.setId(5L);
        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(adminUser));
        when(userRepository.findById(5L)).thenReturn(Optional.of(normalUser));

        TimeEntry entry = new TimeEntry();
        when(timeEntryRepository.findAllByAttendanceUser(normalUser)).thenReturn(List.of(entry));

        ResponseEntity<List<TimeEntry>> response = adminController.getUserActivities("admin@test.com", 5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getUserActivities_userNotFound_throwsException() {
        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(adminUser));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                adminController.getUserActivities("admin@test.com", 99L)
        );

        assertEquals("User not found", exception.getMessage());
    }
}