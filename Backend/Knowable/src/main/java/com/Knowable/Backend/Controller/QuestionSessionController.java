package com.Knowable.Backend.Controller;

import com.Knowable.Backend.Model.QuestionSession;
import com.Knowable.Backend.dto.QuestionSessionDTO;
import com.Knowable.Backend.service.QuestionSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionSessionController {

    private final QuestionSessionService questionSessionService;

    public QuestionSessionController(QuestionSessionService questionSessionService) {
        this.questionSessionService = questionSessionService;
    }

    @PostMapping("/document/{documentId}")
    public ResponseEntity<QuestionSession> askQuestion(
            @PathVariable Long documentId,
            @RequestBody QuestionSessionDTO dto) {
        return ResponseEntity.ok(questionSessionService.askQuestion(documentId, dto));
    }

    @GetMapping("/getDocumentQuestions/{documentId}")
    public ResponseEntity<List<QuestionSession>> getAllQuestions(@PathVariable Long documentId) {
        return ResponseEntity.ok(questionSessionService.getQuestionsForDocument(documentId));
    }
}
