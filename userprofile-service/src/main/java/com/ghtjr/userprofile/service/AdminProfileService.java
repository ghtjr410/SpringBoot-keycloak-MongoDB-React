package com.ghtjr.userprofile.service;

import com.ghtjr.userprofile.dto.AdminProfileRequest;
import com.ghtjr.userprofile.dto.AdminProfileResponse;
import com.ghtjr.userprofile.model.Userprofile;
import com.ghtjr.userprofile.repository.UserprofileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminProfileService {
    private final UserprofileRepository userprofileRepository;

    public AdminProfileResponse createOrUpdateAdminProfile(String uuid, AdminProfileRequest adminProfileRequest) {
        Userprofile userprofile = userprofileRepository.findById(uuid)
                .orElse(new Userprofile());
        userprofile.setUuid(uuid);
        userprofile.setBio(adminProfileRequest.bio());
        userprofile.setBlogTitle(adminProfileRequest.blogTitle());

        Userprofile savedUserprofile = userprofileRepository.save(userprofile);
        return new AdminProfileResponse(
                savedUserprofile.getUuid(),
                savedUserprofile.getBio(),
                savedUserprofile.getBlogTitle()
        );
    }

    public AdminProfileResponse getAdminProfile(String uuid) {
        Userprofile userprofile = userprofileRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        return new AdminProfileResponse(
                userprofile.getUuid(),
                userprofile.getBio(),
                userprofile.getBlogTitle()
        );
    }

}
