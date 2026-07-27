package com.eventxplora.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateWorkLogRequest {

    @NotBlank
    private String note;

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
