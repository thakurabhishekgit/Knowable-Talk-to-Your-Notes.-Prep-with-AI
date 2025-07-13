package com.Knowable.Backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 5, max = 20, message = "Name must be between 5 to 20 characters")
    private String username;

    @NotBlank(message = "Password is required")

    private String password;

    @Email
    private String email;

    private MultipartFile profilePicture; // For input (upload)
    private String profilePictureUrl; // For Cloudinary URL

    @NotBlank(message = "University name is required")
    private String universityName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<Long> workspaceIds;

}
