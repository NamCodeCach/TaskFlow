package com.network.kanban.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

/** Wrapper trả về lỗi dạng JSON */
@Data
@AllArgsConstructor
public class ErrorMessage {
    private String error;
}
