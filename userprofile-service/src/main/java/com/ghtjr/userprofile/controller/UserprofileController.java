package com.ghtjr.userprofile.controller;

import com.ghtjr.userprofile.dto.UserprofileRequest;
import com.ghtjr.userprofile.model.Userprofile;
import com.ghtjr.userprofile.service.UserprofileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-profile")
@RequiredArgsConstructor
public class UserprofileController {

    private final UserprofileService userprofileService;

    @PostMapping("/{uuid}")
    @ResponseStatus(HttpStatus.CREATED)
    public Userprofile createUserProfile(@PathVariable String uuid,
                                         @RequestBody UserprofileRequest userprofileRequest){
        return userprofileService.createOrUpdateUserProfile(uuid, userprofileRequest)
    }
}
