package com.Knowable.Backend.Model;

import java.time.LocalDateTime;
import java.util.List;

import com.drew.lang.annotations.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "workshop name is required")
    @Size(min = 2, max = 50, message = "workshop name must ne between 5 to 30")
    @NotNull
    private String name;

    @NotBlank(message = "description is required")
    @Size(min = 5, max = 100, message = "description must be between 5 to 100")
    @NotNull
    private String description;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Document> documents;

}
