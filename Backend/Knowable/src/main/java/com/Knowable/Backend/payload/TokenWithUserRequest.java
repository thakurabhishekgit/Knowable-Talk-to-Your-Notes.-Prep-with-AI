package com.Knowable.Backend.payload;

import com.Knowable.Backend.dto.UserDTO;
import lombok.Data;

@Data
public class TokenWithUserRequest {
    private String token;
    private UserDTO user;

    public TokenWithUserRequest(UserDTO user, String token) {
        this.user = user;
        this.token = token;
    }
}
