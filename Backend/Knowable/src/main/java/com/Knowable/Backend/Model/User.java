package com.Knowable.Backend.Model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "KnowableUser")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 20, message = "name must ne between 5 to 30")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 5, max = 20, message = "password must ne between 5 to 30")
    private String password;

    @Email
    private String Email;

    private String profilePictureUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @NotBlank(message = "University name is required")
    private String UniveristyName;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Workspace> workspaces;

}
