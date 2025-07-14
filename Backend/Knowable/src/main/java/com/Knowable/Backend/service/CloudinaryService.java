package com.Knowable.Backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadProfileImage(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "image", // handles pdf, ppt, docx
                        "folder", "knowable_docs" // optional: Cloudinary folder
                ));

        return result.get("secure_url").toString(); // Return the Cloudinary URL
    }

    @SuppressWarnings("unchecked")
    public String uploadFile(MultipartFile file) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "auto",
                        "folder", "knowable",
                        "type", "upload",
                        "access_mode", "public"));

        return uploadResult.get("secure_url").toString(); // Return the Cloudinary URL
    }
}
