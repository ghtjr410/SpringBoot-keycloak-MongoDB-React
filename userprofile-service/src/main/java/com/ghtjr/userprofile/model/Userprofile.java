package com.ghtjr.userprofile.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "user_profiles")
public class Userprofile {
    @Id
    private String uuid;
    private String bio;
    private String blogTitle;
}
