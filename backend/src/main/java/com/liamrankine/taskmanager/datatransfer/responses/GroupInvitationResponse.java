package com.liamrankine.taskmanager.datatransfer.responses;

import com.liamrankine.taskmanager.enumerations.InvitationStatus;

import java.time.LocalDate;

public class GroupInvitationResponse {
    private Long id;
    private Long groupId;
    private String groupName;
    private String email;
    private String token;
    private InvitationStatus status;
    private LocalDate expiresAt;

    public GroupInvitationResponse() {}
    public GroupInvitationResponse(
            Long id,
            Long groupId,
            String groupName,
            String email,
            String token,
            InvitationStatus status,
            LocalDate expiresAt
    ) {
        this.id = id;
        this.groupId = groupId;
        this.groupName = groupName;
        this.email = email;
        this.token = token;
        this.status = status;
        this.expiresAt = expiresAt;
    }

    //Getters
    public Long getId() {
        return id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }

    public InvitationStatus getStatus() {
        return status;
    }

    public LocalDate getExpiresAt() {
        return expiresAt;
    }

    //Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setStatus(InvitationStatus status) {
        this.status = status;
    }

    public void setExpiresAt(LocalDate expiresAt) {
        this.expiresAt = expiresAt;
    }

}
