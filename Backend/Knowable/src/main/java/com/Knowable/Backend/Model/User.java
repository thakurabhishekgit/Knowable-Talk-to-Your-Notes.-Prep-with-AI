package com.Knowable.Backend.Model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "KnowableUser")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 50, message = "Name must be between 5 to 50 characters")
    private String username;

    private String password;

    @Email
    private String email;

    private String profilePictureUrl;

    @NotBlank(message = "University name is required")
    private String universityName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore // ✅ Prevents infinite loop during serialization
    private List<Workspace> workspaces;

}
