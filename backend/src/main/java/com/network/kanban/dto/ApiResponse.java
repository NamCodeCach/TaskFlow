package com.network.kanban.dto;

import org.springframework.core.SpringVersion;

public class ApiResponse {

    private String code;
    private String message;
    private Object data;
    private String role;

    public ApiResponse() {
    }

    public ApiResponse(String code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse("success", message, data);
    }

    public static ApiResponse error(String message) {
        return new ApiResponse("error", message, null);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}