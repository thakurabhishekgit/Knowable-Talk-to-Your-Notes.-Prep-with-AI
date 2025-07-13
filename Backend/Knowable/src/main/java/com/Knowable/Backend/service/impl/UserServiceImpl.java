package com.Knowable.Backend.service.impl;

import com.Knowable.Backend.Model.User;
import com.Knowable.Backend.dto.UserDTO;
import com.Knowable.Backend.repository.UserRepository;
import com.Knowable.Backend.service.CloudinaryService;
import com.Knowable.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
            CloudinaryService cloudinaryService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDTO createUser(UserDTO userDTO, MultipartFile profilePicture) {
        try {
            String imageUrl = cloudinaryService.uploadProfileImage(profilePicture);

            User user = convertToEntity(userDTO);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setProfilePictureUrl(imageUrl);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            return convertToDTO(userRepository.save(user));
        } catch (IOException e) {
            throw new RuntimeException("Profile picture upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setUniversityName(userDTO.getUniversityName());
        user.setUpdatedAt(LocalDateTime.now());

        if (userDTO.getProfilePicture() != null && !userDTO.getProfilePicture().isEmpty()) {
            try {
                String newUrl = cloudinaryService.uploadProfileImage(userDTO.getProfilePicture());
                user.setProfilePictureUrl(newUrl);
            } catch (IOException e) {
                throw new RuntimeException("Profile picture update failed", e);
            }
        }

        return convertToDTO(userRepository.save(user));
    }

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setUniversityName(user.getUniversityName());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    private User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setEmail(dto.getEmail());
        user.setUniversityName(dto.getUniversityName());
        user.setProfilePictureUrl(dto.getProfilePictureUrl());
        user.setCreatedAt(dto.getCreatedAt());
        user.setUpdatedAt(dto.getUpdatedAt());
        return user;
    }
}
