package com.Knowable.Backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 20, message = "Name must be between 5 to 20 characters")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 5, max = 20, message = "Password must be between 5 to 20 characters")
    private String password;

    @Email
    private String email;

    private MultipartFile profilePictureUrl;

    @NotBlank(message = "University name is required")
    private String univeristyName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<Long> workspaceIds; // Reference only
}
