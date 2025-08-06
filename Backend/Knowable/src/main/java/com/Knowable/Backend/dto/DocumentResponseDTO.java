package com.Knowable.Backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Data

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class DocumentResponseDTO {
    private Long id;
    private String title;
    private String fileType;
    private String fileUrl;
    private LocalDateTime uploadedAt;
}
