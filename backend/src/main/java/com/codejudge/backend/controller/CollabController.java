package com.codejudge.backend.controller;

import com.codejudge.backend.dto.CollabMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class CollabController {

    @MessageMapping("/collab/{sessionId}")
    @SendTo("/topic/session/{sessionId}")
    public CollabMessage handleCollabMessage(@DestinationVariable String sessionId, @Payload CollabMessage message) {
        // Broadcast the message to all participants in the same session
        return message;
    }
}
