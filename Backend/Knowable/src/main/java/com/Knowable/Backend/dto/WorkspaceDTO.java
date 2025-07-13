package com.Knowable.Backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class WorkspaceDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
