package com.Knowable.Backend.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Title is required")
    private String title;

    private String fileType;

    private String fileUrl;

    @Lob
    private String textExtracted;

    private LocalDateTime uploadedAt;

    @ManyToOne
    @JoinColumn(name = "workspace_id")

    private Workspace workspace;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
    private List<QuestionSession> questionSessions;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL)
    private List<PreviousYearPaper> previousYearPapers;
}