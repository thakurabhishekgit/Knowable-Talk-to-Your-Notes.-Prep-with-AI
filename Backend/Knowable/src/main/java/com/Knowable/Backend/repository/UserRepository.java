package com.Knowable.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Knowable.Backend.Model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    // Additional query methods can be defined here if needed

}
