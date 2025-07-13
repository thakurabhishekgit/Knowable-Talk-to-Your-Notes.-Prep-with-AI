package com.Knowable.Backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class DocumentDTO {
    private String title;
    private MultipartFile file; // for input only
}
