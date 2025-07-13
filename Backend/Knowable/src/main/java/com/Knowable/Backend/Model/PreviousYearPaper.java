package com.Knowable.Backend.Model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PreviousYearPaper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subjectName;

    private String fileUrl;

    @Lob
    private String textExtracted;

    private LocalDateTime uploadedAt;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "document_id")
    private Document document;
}
