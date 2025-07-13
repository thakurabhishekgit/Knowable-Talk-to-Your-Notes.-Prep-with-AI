package com.Knowable.Backend.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreviousYearPaperDTO {
    private String subjectName;
    private MultipartFile file;
}
