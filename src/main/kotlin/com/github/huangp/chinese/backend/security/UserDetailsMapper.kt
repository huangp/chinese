package com.github.huangp.chinese.backend.security

import com.github.huangp.chinese.backend.model.Supervisor
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component


@Component
class UserDetailsMapper {
    fun toUserDetails(supervisor: Supervisor): UserDetails {
        return User.withUsername(supervisor.username)
                .password(supervisor.passwordHash)
                .roles(Roles.Supervisor.name)
                .build()
    }
}