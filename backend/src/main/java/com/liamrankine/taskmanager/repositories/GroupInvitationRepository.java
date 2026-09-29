package com.liamrankine.taskmanager.repositories;

import com.liamrankine.taskmanager.entities.GroupInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GroupInvitationRepository extends JpaRepository<GroupInvitation, Long> {
    Optional<GroupInvitation> findByToken(String token);
}
