package com.codejudge.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "scratchpads")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Scratchpad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long problemId;

    private String username;

    @Column(columnDefinition = "TEXT")
    private String canvasData; // Base64 or JSON strokes
}
