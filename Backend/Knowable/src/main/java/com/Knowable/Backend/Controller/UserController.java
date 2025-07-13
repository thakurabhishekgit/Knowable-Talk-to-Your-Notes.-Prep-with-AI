package com.Knowable.Backend.Controller;

import com.Knowable.Backend.dto.UserDTO;
import com.Knowable.Backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated

public class UserController {

    private final UserService userService;

    // ✅ Register user (JSON only)
    @PostMapping("/registerUser")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.createUser(userDTO, null); // No image here
        return ResponseEntity.ok(createdUser);
    }

    // ✅ Upload profile picture separately
    @PostMapping("/uploadProfilePicture/{id}")
    public ResponseEntity<String> uploadProfilePicture(
            @PathVariable Long id,
            @RequestParam("profilePicture") MultipartFile profilePicture) {

        userService.updateProfilePicture(id, profilePicture);
        return ResponseEntity.ok("Profile picture uploaded successfully.");
    }

    // ✅ Update user (without handling profile picture)
    @PutMapping("/updateUser/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {

        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // ✅ Get user by ID
    @GetMapping("/getUser/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ✅ Get all users
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Delete user
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
