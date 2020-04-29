package com.github.huangp.chinese.backend.repository

import com.github.huangp.chinese.backend.model.LearnerUser
import com.github.huangp.chinese.backend.model.Supervisor
import org.springframework.data.repository.CrudRepository

interface LearnerRepository : CrudRepository<LearnerUser, Long> {
    fun findByUsername(username: String): LearnerUser?

    fun findAllByUsernameIn(usernames: Iterable<String>): List<LearnerUser>

    fun findAllByActive(active: Boolean = true): List<LearnerUser>

    fun findAllBySupervisorEqualsAndActiveTrue(supervisor: Supervisor): List<LearnerUser>
}