package com.github.huangp.chinese.backend.security

import com.github.huangp.chinese.backend.repository.SupervisorRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsPasswordService
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException

class AuthUserDetailService(private val supervisorRepository: SupervisorRepository,
                            private val userDetailsMapper: UserDetailsMapper) : UserDetailsService, UserDetailsPasswordService {
    override fun loadUserByUsername(username: String): UserDetails {
        val supervisor = supervisorRepository.findById(username)
        return if (supervisor.isPresent) {
            userDetailsMapper.toUserDetails(supervisor.get())
        } else {
            throw UsernameNotFoundException("$username not found")
        }
    }

    // allow user's password being migrated using stronger work factor. see PasswordEncoder
    override fun updatePassword(user: UserDetails, newPassword: String): UserDetails {
        val supervisor = supervisorRepository.findById(user.username)
        return if (supervisor.isPresent) {
            val entity = supervisor.get()
            entity.passwordHash = newPassword
            supervisorRepository.save(entity)
            userDetailsMapper.toUserDetails(entity)
        } else {
            throw UsernameNotFoundException("${user.username} not found")
        }
    }
}