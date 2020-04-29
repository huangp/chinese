package com.github.huangp.chinese.backend.service

import com.github.huangp.chinese.backend.model.Supervisor
import com.github.huangp.chinese.backend.repository.SupervisorRepository
import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import javax.inject.Inject


@Service
class AuthenticatedSupervisorService @Inject constructor(private val supervisorRepository: SupervisorRepository) {
    fun getAuthenticatedSupervisor(): Supervisor {
        val authentication: Authentication = SecurityContextHolder.getContext().authentication
        return if (authentication !is AnonymousAuthenticationToken) {
            val supervisor = supervisorRepository.findById(authentication.name)
            supervisor.get()
        } else {
            throw BadCredentialsException("need to sign in")
        }
    }
}