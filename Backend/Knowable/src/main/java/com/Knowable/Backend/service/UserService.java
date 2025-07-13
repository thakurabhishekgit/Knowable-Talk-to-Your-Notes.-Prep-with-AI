package com.Knowable.Backend.service;

import com.Knowable.Backend.dto.UserDTO;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserDTO createUser(UserDTO userDTO, MultipartFile profilePicture);

    UserDTO updateProfilePicture(Long id, MultipartFile profilePicture);

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();

    UserDTO updateUser(Long id, UserDTO userDTO);

    void deleteUser(Long id);
}
