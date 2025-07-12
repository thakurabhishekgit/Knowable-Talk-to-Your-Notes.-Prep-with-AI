package com.Knowable.Backend.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;

    @Lob
    private String answer;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "document_id")
    private Document document;
}