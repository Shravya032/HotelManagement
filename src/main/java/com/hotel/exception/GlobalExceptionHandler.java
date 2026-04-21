package com.hotel.exception;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public String handleValidation(MethodArgumentNotValidException ex) {
        return ex.getBindingResult().getFieldError().getDefaultMessage();
    }

    @ExceptionHandler(RuntimeException.class)
    public String handleRuntime(RuntimeException ex) {
        return ex.getMessage();
    }
}