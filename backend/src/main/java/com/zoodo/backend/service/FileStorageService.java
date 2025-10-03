package com.zoodo.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${uploads.dir:uploads}")
    private String uploadsDir;

    public String store(String subdirectory, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String original = Objects.requireNonNullElse(file.getOriginalFilename(), "file");
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) {
            ext = original.substring(dot);
        }
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String filename = UUID.randomUUID() + "_" + timestamp + ext;

        Path base = Paths.get(uploadsDir).toAbsolutePath().normalize();
        Path targetDir = base.resolve(subdirectory).normalize();
        Files.createDirectories(targetDir);

        Path target = targetDir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        // Return a relative path suitable for later retrieval
        return base.relativize(target).toString().replace('\\', '/');
    }
}


