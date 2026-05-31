package Alex.D.dev.controller;

import lombok.Data;


@Data
class EntryRequest {
    private String date;
    private Long assignmentId;
    private int workedMinutes;
    private String description;
}
