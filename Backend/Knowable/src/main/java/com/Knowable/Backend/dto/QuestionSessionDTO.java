package com.Knowable.Backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionSessionDTO {
    private String question;
    private String answer; // optional if handled by AI/logic
    private LocalDateTime createdAt;
}
