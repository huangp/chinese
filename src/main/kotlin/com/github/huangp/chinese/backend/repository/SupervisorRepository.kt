package com.github.huangp.chinese.backend.repository

import com.github.huangp.chinese.backend.model.Supervisor
import org.springframework.data.repository.CrudRepository

interface SupervisorRepository : CrudRepository<Supervisor, String> {
}