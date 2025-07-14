package com.Knowable.Backend.Controller;

import com.Knowable.Backend.config.JWT.JwtUtil;
import com.Knowable.Backend.dto.UserDTO;
import com.Knowable.Backend.payload.TokenWithUserRequest;
import com.Knowable.Backend.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated

public class UserController {

    private final UserService userService;

    @PostMapping("/registerUser")
    public ResponseEntity<TokenWithUserRequest> registerUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.createUser(userDTO, null);

        String token = JwtUtil.generateToken(createdUser.getEmail());
        TokenWithUserRequest tokenWithUserRequest = new TokenWithUserRequest(createdUser, token);

        return ResponseEntity.ok(tokenWithUserRequest);
    }

    @PostMapping(value = "/uploadProfilePicture/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> uploadProfilePicture(
            @PathVariable Long id,
            @RequestPart("profilePicture") MultipartFile file) {
        System.out.println(">>> Received file: " + file.getOriginalFilename());
        UserDTO updatedUser = userService.updateProfilePicture(id, file);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/updateProfilePicture/{id}")
    public ResponseEntity<UserDTO> updateProfilePicture(
            @PathVariable Long id,
            @RequestPart("profilePicture") MultipartFile file) {
        UserDTO updatedUser = userService.updateProfilePicture(id, file);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/updateUser/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDTO userDTO) {

        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<TokenWithUserRequest> loginUser(
            @RequestBody UserDTO userDTO) {
        UserDTO user = userService.LoginUser(userDTO);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        String token = JwtUtil.generateToken(user.getEmail());
        TokenWithUserRequest tokenWithUserRequest = new TokenWithUserRequest(user, token);

        return ResponseEntity.ok(tokenWithUserRequest);
    }
}
