package com.ghtjr.userprofile.service;

import com.ghtjr.userprofile.dto.UserprofileRequest;
import com.ghtjr.userprofile.dto.UserprofileResponse;
import com.ghtjr.userprofile.model.Userprofile;
import com.ghtjr.userprofile.repository.UserprofileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserprofileService {
    private final UserprofileRepository userprofileRepository;

    public UserprofileResponse createOrUpdateUserProfile(String uuid, UserprofileRequest userprofileRequest) {
        // 값이 있을경우와 없을경우
        Userprofile userprofile = userprofileRepository.findById(uuid)
                .orElse(new Userprofile());

        userprofile.setUuid(uuid);
        userprofile.setBio(userprofileRequest.bio());
        userprofile.setBlogTitle(userprofileRequest.blogTitle());

        Userprofile savedUserprofile = userprofileRepository.save(userprofile);

        return new UserprofileResponse(
                savedUserprofile.getUuid(),
                savedUserprofile.getBio(),
                savedUserprofile.getBlogTitle()
        );
    }

    public UserprofileResponse getUserProfile(String uuid) {
        Userprofile userprofile = userprofileRepository.findById(uuid)
                .orElseThrow(() -> new RuntimeException("User profile not found"));

        return new UserprofileResponse(
                userprofile.getUuid(),
                userprofile.getBio(),
                userprofile.getBlogTitle()
        );
    }
}
