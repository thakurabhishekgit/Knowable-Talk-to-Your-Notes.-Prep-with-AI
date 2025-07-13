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

    // ✅ Register new user
    @PostMapping(value = "/registerUser", consumes = { "multipart/form-data" })
    public ResponseEntity<UserDTO> registerUser(
            @Valid @RequestPart("user") UserDTO userDTO,
            @RequestPart("profilePicture") MultipartFile profilePicture) {

        UserDTO createdUser = userService.createUser(userDTO, profilePicture);
        return ResponseEntity.ok(createdUser);
    }

    // ✅ Update user by ID
    @PutMapping(value = "/updateUser/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestPart("user") UserDTO userDTO,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {

        if (profilePicture != null && !profilePicture.isEmpty()) {
            userDTO.setProfilePicture(profilePicture);
        }

        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    // ✅ Get single user by ID
    @GetMapping("/getUser/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // ✅ Get all users
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ✅ Delete user by ID
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
