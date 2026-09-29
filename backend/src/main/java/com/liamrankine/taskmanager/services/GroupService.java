package com.liamrankine.taskmanager.services;

import com.liamrankine.taskmanager.datatransfer.requests.group.GroupCreationRequest;
import com.liamrankine.taskmanager.datatransfer.requests.group.GroupUpdateRequest;
import com.liamrankine.taskmanager.datatransfer.requests.groupinvitation.GroupInvitationRequest;
import com.liamrankine.taskmanager.datatransfer.requests.groupmembership.GroupMembershipCreateRequest;
import com.liamrankine.taskmanager.datatransfer.requests.groupmembership.GroupMembershipUpdateRequest;
import com.liamrankine.taskmanager.datatransfer.responses.GroupInvitationResponse;
import com.liamrankine.taskmanager.datatransfer.responses.GroupResponse;
import com.liamrankine.taskmanager.entities.*;
import com.liamrankine.taskmanager.enumerations.GroupRole;
import com.liamrankine.taskmanager.enumerations.InvitationStatus;
import com.liamrankine.taskmanager.repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class GroupService {

    private final AppUserRepository appUserRepo;
    private final GroupRepository groupRepo;
    private final TaskRepository taskRepo;
    private final GroupMembershipRepository groupMembershipRepo;
    private final TaskAssignmentRepository taskAssignmentRepo;
    private final PasswordEncoder passwordEncoder;
    private final GroupInvitationRepository groupInvitationRepository;
    private final EmailService emailService;

    public GroupService(AppUserRepository appUserRepo, GroupRepository groupRepo,
                          TaskRepository taskRepo, PasswordEncoder passwordEncoder,
                          GroupMembershipRepository groupMembershipRepo,
                          TaskAssignmentRepository taskAssignmentRepo,
                          GroupInvitationRepository groupInvitationRepository,
                          EmailService emailService
    ) {
        this.appUserRepo = appUserRepo;
        this.groupRepo = groupRepo;
        this.taskRepo = taskRepo;
        this.groupMembershipRepo = groupMembershipRepo;
        this.taskAssignmentRepo = taskAssignmentRepo;
        this.passwordEncoder = passwordEncoder;
        this.groupInvitationRepository = groupInvitationRepository;
        this.emailService = emailService;
    }

    //GETS
    public List<GroupResponse> getGroups() {
        List<Group> groups = groupRepo.findAll();
        List<GroupResponse> responses = new ArrayList<>();
        for (Group group : groups) {
            GroupResponse newResponse = new GroupResponse(group);
            responses.add(newResponse);
        }
        return responses;
    }

    public GroupResponse getGroupByID(Long id) {
        Group group = groupRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find group with id: " + id));
        return new GroupResponse(group);
    }

    public List<GroupResponse> getGroupByUserID(Long id) {
        appUserRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<GroupMembership> groupMemberships = groupMembershipRepo.findByMember_Id(id);

        return groupMemberships.stream().map(GroupMembership::getGroup).map(GroupResponse::new).toList();
    }

    public GroupInvitationResponse getInvitationByToken(String token) {
        GroupInvitation groupInvitation = groupInvitationRepository.findByToken(token).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Group invite not found"));

        return new GroupInvitationResponse(
                groupInvitation.getId(),
                groupInvitation.getGroup().getId(),
                groupInvitation.getGroup().getName(),
                groupInvitation.getEmail(),
                groupInvitation.getToken(),
                groupInvitation.getStatus(),
                groupInvitation.getExpiresAt()
                );
    }

    //POSTS
    @Transactional
    public void createGroup(GroupCreationRequest request) {

        Group group = new Group(request.getName(), request.getDescription());
        AppUser owner = appUserRepo.findById(request.getCreatorId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find user"));

        GroupMembership membership = new GroupMembership(group, owner, GroupRole.OWNER);
        group.addMembership(membership);

        groupRepo.save(group);
        groupMembershipRepo.save(membership);
    }

    @Transactional
    public void createGroupMembership(GroupMembershipCreateRequest request) {
        Group group = groupRepo.findById(request.getGroupId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find group"));
        AppUser user = appUserRepo.findById(request.getMemberId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find user"));
        GroupRole role = request.getRole();

        GroupMembership membership = new GroupMembership(group, user, role);
        group.addMembership(membership);
        user.addMembership(membership);

        groupMembershipRepo.save(membership);
    }

    @Transactional
    public void inviteToGroup(Long groupId, GroupInvitationRequest request) {
        Group group = groupRepo.findById(request.getGroupId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find group"));

        String token = UUID.randomUUID().toString();

        GroupInvitation groupInvitation = new GroupInvitation(group, request.getEmail(), token, InvitationStatus.PENDING, LocalDate.now().plusWeeks(1));
        groupInvitationRepository.save(groupInvitation);

        emailService.sendInvitationEmail(request.getEmail(), group.getName(), token);
    }

    @Transactional
    public void acceptInvite(String token) {
        GroupInvitation groupInvitation = groupInvitationRepository.findByToken(token).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find invitation"));

        AppUser user = appUserRepo.findByEmail(groupInvitation.getEmail()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, " Unable to find user"));
        GroupMembership membership = new GroupMembership(groupInvitation.getGroup(), user, GroupRole.MEMBER);
        user.addMembership(membership);
        groupMembershipRepo.save(membership);
    }

    //PATCHES
    @Transactional
    public void updateGroup(Long id, GroupUpdateRequest request) {
        Group group = groupRepo.findById(request.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find group"));
        group.setName(request.getName());
        group.setDescription(request.getDescription());
    }

    @Transactional
    public void updateGroupMembership(GroupMembershipUpdateRequest request) {
        Group group = groupRepo.findById(request.getGroupId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find group"));
        AppUser user = appUserRepo.findById(request.getMemberId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find user"));
        GroupMembership membership = groupMembershipRepo.findByGroup_IdAndMember_Id(group.getId(), user.getId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find membership"));

        membership.setRole(request.getRole());
    }

    //DELETES
    @Transactional
    public void deleteGroupByID(Long id) {
        Group deletedGroup = groupRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find group"));
        groupRepo.delete(deletedGroup);
    }

    @Transactional
    public void deleteGroupMembershipByIDs(Long groupId, Long memberId) {
        GroupMembership membership = groupMembershipRepo.findByGroup_IdAndMember_Id(groupId, memberId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Unable to find group or user"));
        membership.getGroup().removeMembership(membership);
    }
}
