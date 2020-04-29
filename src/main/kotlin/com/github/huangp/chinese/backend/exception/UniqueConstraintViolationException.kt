package com.github.huangp.chinese.backend.exception

import javax.ws.rs.core.Response
import javax.ws.rs.ext.ExceptionMapper
import javax.ws.rs.ext.Provider

class UniqueConstraintViolationException(message: String) : RuntimeException(message)

@Provider
class UniqueConstraintViolationExceptionMapper : ExceptionMapper<UniqueConstraintViolationException> {
    override fun toResponse(ex: UniqueConstraintViolationException?): Response {
        return Response.status(Response.Status.CONFLICT)
                .entity(listOf("Uniqueness constraint violated. Resource already exists", ex?.message))
                .build();
    }
}