package com.izatec.pay.infra.response;

import lombok.Data;

@Data
public class ResponsePage {
    private int pageNumber;
    private int pageSize;
    private int totalPages;
    private long totalElements;
    private boolean first;
    private int numberOfElements;
    private int size;
}
