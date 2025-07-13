package com.Knowable.Backend.Controller;

import com.Knowable.Backend.Model.PreviousYearPaper;
import com.Knowable.Backend.dto.PreviousYearPaperDTO;
import com.Knowable.Backend.service.PreviousYearPaperService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/previous-papers")
public class PreviousYearPaperController {

    private final PreviousYearPaperService previousYearPaperService;

    public PreviousYearPaperController(PreviousYearPaperService previousYearPaperService) {
        this.previousYearPaperService = previousYearPaperService;
    }

    @PostMapping("/upload/{documentId}")
    public ResponseEntity<PreviousYearPaper> uploadPaper(
            @PathVariable Long documentId,
            @RequestParam("subjectName") String subjectName,
            @RequestParam("file") MultipartFile file) {

        PreviousYearPaperDTO dto = PreviousYearPaperDTO.builder()
                .subjectName(subjectName)
                .file(file)
                .build();

        return ResponseEntity.ok(previousYearPaperService.uploadPreviousYearPaper(documentId, dto));
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<PreviousYearPaper>> getPapersByDocument(@PathVariable Long documentId) {
        return ResponseEntity.ok(previousYearPaperService.getAllPapersForDocument(documentId));
    }
}
