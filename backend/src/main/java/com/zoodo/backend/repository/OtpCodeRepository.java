package com.zoodo.backend.repository;

import com.zoodo.backend.model.OtpCode;
import com.zoodo.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, UUID> {
    List<OtpCode> findByUserAndPurposeAndUsedAtIsNullOrderByCreatedAtDesc(User user, OtpCode.OtpPurpose purpose);
}
