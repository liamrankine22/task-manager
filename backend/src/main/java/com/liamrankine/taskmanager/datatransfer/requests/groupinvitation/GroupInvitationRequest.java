package com.liamrankine.taskmanager.datatransfer.requests.groupinvitation;

import com.liamrankine.taskmanager.enumerations.InvitationStatus;

import java.time.LocalDate;

public class GroupInvitationRequest {
    private Long groupId;
    private String email;

    // No-argument constructor
    public GroupInvitationRequest() {
    }

    // Constructor with all fields
    public GroupInvitationRequest(Long groupId, String email) {
        this.groupId = groupId;
        this.email = email;
    }

    // Getters and Setters
    public Long getGroupId() {
        return groupId;
    }

    public String getEmail() {
        return email;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
