package com.Knowable.Backend.service.impl;

import com.Knowable.Backend.Model.User;
import com.Knowable.Backend.dto.UserDTO;
import com.Knowable.Backend.repository.UserRepository;
import com.Knowable.Backend.service.CloudinaryService;
import com.Knowable.Backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, CloudinaryService cloudinaryService) {
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public UserDTO createUser(UserDTO userDTO, MultipartFile profilePicture) {
        try {
            String imageUrl = cloudinaryService.uploadProfileImage(profilePicture);
            User user = User.builder()
                    .username(userDTO.getUsername())
                    .password(userDTO.getPassword()) // Consider encoding this
                    .Email(userDTO.getEmail())
                    .UniveristyName(userDTO.getUniveristyName())
                    .profilePictureUrl(imageUrl)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            return convertToDTO(userRepository.save(user));

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload profile image: " + e.getMessage(), e);
        }
    }

    @Override
    public UserDTO getUserById(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        return userOpt.map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setUniveristyName(userDTO.getUniveristyName());
        user.setUpdatedAt(LocalDateTime.now());

        return convertToDTO(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .univeristyName(user.getUniveristyName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
