package com.Knowable.Backend.Controller;

import com.Knowable.Backend.Model.Workspace;
import com.Knowable.Backend.dto.WorkspaceDTO;
import com.Knowable.Backend.service.WorkspaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workspace")
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Workspace> createWorkspace(@PathVariable Long userId, @RequestBody WorkspaceDTO dto) {
        Workspace workspace = workspaceService.createWorkspace(userId, dto);
        return ResponseEntity.ok(workspace);
    }

    @DeleteMapping("/user/{userId}/workspace/{workspaceId}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable Long userId, @PathVariable Long workspaceId) {
        workspaceService.deleteWorkspace(userId, workspaceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Workspace>> getUserWorkspaces(@PathVariable Long userId) {
        return ResponseEntity.ok(workspaceService.getWorkspacesByUser(userId));
    }
}
