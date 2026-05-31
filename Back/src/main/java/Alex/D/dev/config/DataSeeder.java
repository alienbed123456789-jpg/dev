package Alex.D.dev.config;

import Alex.D.dev.entity.*;
import Alex.D.dev.repository.AssignmentRepository;
import Alex.D.dev.repository.AttendanceRepository;
import Alex.D.dev.repository.TimeEntryRepository;
import Alex.D.dev.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase(
            UserRepository userRepository,
            AssignmentRepository assignmentRepository,
            AttendanceRepository attendanceRepository,
            TimeEntryRepository timeEntryRepository,
            BCryptPasswordEncoder passwordEncoder) {


        return args -> {

if (userRepository.count() > 0) {
                System.out.println("already fill");
                return;
            }
            User admin = new User();
            admin.setEmail("admin@timeflow.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRule(Rules.ADMIN);
            admin.setEnabled(true);

            User user1 = new User();
            user1.setEmail("john@timeflow.com");
            user1.setPassword(passwordEncoder.encode("user123"));
            user1.setRule(Rules.USER);
            user1.setEnabled(true);

            User user2 = new User();
            user2.setEmail("jane@timeflow.com");
            user2.setPassword(passwordEncoder.encode("user123"));
            user2.setRule(Rules.USER);
            user2.setEnabled(true);

            userRepository.saveAll(Arrays.asList(admin, user1, user2));

            List<Assignment> assignments = Arrays.asList(
                    createAssignment("Development", "DEV_01", AssignmentType.WORK),
                    createAssignment("Code Review", "CR_02", AssignmentType.WORK),
                    createAssignment("Meetings", "MEET_03", AssignmentType.WORK),
                    createAssignment("System Design", "SYS_04", AssignmentType.WORK),
                    createAssignment("DevOps & CI/CD", "DEV_05", AssignmentType.WORK),
                    createAssignment("Paid Vacation", "VAC_01", AssignmentType.VACATION),
                    createAssignment("Sick Leave", "SICK_02", AssignmentType.VACATION),
                    createAssignment("National Holiday", "HOL_01", AssignmentType.HOLIDAY),
                    createAssignment("Company Holiday", "HOL_02", AssignmentType.HOLIDAY)
            );
            assignmentRepository.saveAll(assignments);

            YearMonth lastMonth = YearMonth.now().minusMonths(1);
            int year = lastMonth.getYear();
            int month = lastMonth.getMonthValue();

            Attendance att1 = new Attendance();
            att1.setUser(user1);
            att1.setYear(year);
            att1.setMonth(month);
            attendanceRepository.save(att1);

            Attendance att2 = new Attendance();
            att2.setUser(user2);
            att2.setYear(year);
            att2.setMonth(month);
            attendanceRepository.save(att2);

            Assignment workAssignment = assignments.get(0);

            for (int day = 1; day <= lastMonth.lengthOfMonth(); day++) {
                LocalDate date = lastMonth.atDay(day);

                if (date.getDayOfWeek().getValue() >= 6) continue;

                TimeEntry entry1 = new TimeEntry();
                entry1.setAttendance(att1);
                entry1.setAssignment(workAssignment);
                entry1.setDate(date);
                entry1.setWorkedMinutes(480);
                entry1.setDescription("Regular work day");
                timeEntryRepository.save(entry1);

                TimeEntry entry2 = new TimeEntry();
                entry2.setAttendance(att2);
                entry2.setAssignment(workAssignment);
                entry2.setDate(date);
                entry2.setWorkedMinutes(480);
                entry2.setDescription("Regular work day");
                timeEntryRepository.save(entry2);
            }

            System.out.println("Тестовые данные успешно загружены!");
        };
    }

    private Assignment createAssignment(String name, String code, AssignmentType type) {
        Assignment a = new Assignment();
        a.setName(name);
        a.setCode(code);
        a.setType(type);
        return a;
    }
}