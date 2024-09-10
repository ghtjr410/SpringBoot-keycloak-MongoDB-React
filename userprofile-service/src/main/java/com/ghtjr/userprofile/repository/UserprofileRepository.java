package com.ghtjr.userprofile.repository;

import com.ghtjr.userprofile.model.Userprofile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserprofileRepository extends MongoRepository<Userprofile, String> {
}
