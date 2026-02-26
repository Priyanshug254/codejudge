package com.codejudge.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollabMessage {
    private String sessionId;
    private String userId;
    private String userName;
    private String type; // "CODE_UPDATE", "CURSOR_UPDATE", "CHAT"
    private String content;
    private CursorPosition cursor;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CursorPosition {
        private int line;
        private int column;
    }
}
