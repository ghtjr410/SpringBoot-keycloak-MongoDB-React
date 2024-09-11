package com.ghtjr.userprofile.controller;

import com.ghtjr.userprofile.dto.AdminProfileRequest;
import com.ghtjr.userprofile.dto.AdminProfileResponse;
import com.ghtjr.userprofile.service.AdminProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/user-profile/{uuid}")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminProfileResponse createAdminProfile(@PathVariable String uuid,
                                                   @RequestBody AdminProfileRequest adminProfileRequest) {
        return  adminProfileService.createOrUpdateAdminProfile(uuid, adminProfileRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public AdminProfileResponse getAdminProfile(@PathVariable String uuid) {
        return adminProfileService.getAdminProfile(uuid);
    }
}
