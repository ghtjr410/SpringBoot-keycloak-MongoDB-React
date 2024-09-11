package com.ghtjr.userprofile.controller;

import com.ghtjr.userprofile.dto.UserprofileRequest;
import com.ghtjr.userprofile.dto.UserprofileResponse;
import com.ghtjr.userprofile.service.UserprofileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/user-profile/{uuid}")
@RequiredArgsConstructor
public class UserprofileController {

    private final UserprofileService userprofileService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserprofileResponse createUserProfile(@PathVariable String uuid,
                                                 @RequestBody UserprofileRequest userprofileRequest){
        return userprofileService.createOrUpdateUserProfile(uuid, userprofileRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public UserprofileResponse getUserprofile(@PathVariable String uuid) {
        return userprofileService.getUserProfile(uuid);
    }
}
