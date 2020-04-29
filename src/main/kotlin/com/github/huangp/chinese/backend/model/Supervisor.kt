package com.github.huangp.chinese.backend.model

import com.github.huangp.chinese.backend.dto.SupervisorDto
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.io.Serializable
import java.util.*
import javax.persistence.*

@Entity
@Access(AccessType.FIELD)
@EntityListeners(AuditingEntityListener::class)
class Supervisor(
        @Id
        @Column(unique = true)
        open var username: String?,
        @Column(nullable = false)
        open var passwordHash: String?,
        @Version
        open var version: Int = 0,
        @Column
        open var createDate: Date = Date()
) : Serializable {
    constructor() : this(null, null)

    fun toDto(): SupervisorDto {
        return SupervisorDto(username!!, "<xxx>")
    }

    companion object {
        fun fromDto(dto: SupervisorDto, passwordHash: String): Supervisor {
            return Supervisor(dto.username, passwordHash)
        }
    }
}