package com.Knowable.Backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DocumentResponseDTO {
    private Long id;
    private String title;
    private String fileType;
    private String fileUrl;
    private LocalDateTime uploadedAt;
}
