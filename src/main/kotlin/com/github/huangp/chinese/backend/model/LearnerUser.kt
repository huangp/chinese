package com.github.huangp.chinese.backend.model

import com.github.huangp.chinese.backend.dto.LearnerDto
import javax.persistence.*
import javax.validation.constraints.NotBlank

@Entity
@Access(AccessType.FIELD)
open class LearnerUser(
                   @ManyToOne(fetch = FetchType.EAGER)
                   @JoinColumn(name = "supervisor")
                   open var supervisor: Supervisor?,
                   @Id
                   @get: NotBlank(message = "{username.required}")
                   @Column
                   open var username: String = "",
                   @get: NotBlank(message = "{name.required}")
                   @Column
                   open var name: String = "",
                   @Column
                   open var active: Boolean = true,
                   @Version
                   open var version: Int = 0
) {

    constructor() : this(null)

    fun softDelete(): LearnerUser {
        return LearnerUser(supervisor, username, name,false)
    }

    fun toDto(): LearnerDto {
        return LearnerDto(username, name ?: username)
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as LearnerUser

        if (username != other.username) return false
        if (name != other.name) return false
        if (supervisor != other.supervisor) return false
        if (active != other.active) return false

        return true
    }

    override fun hashCode(): Int {
        var result = username?.hashCode() ?: 0
        result = 31 * result + (name?.hashCode() ?: 0)
        result = 31 * result + supervisor.hashCode()
        result = 31 * result + active.hashCode()
        return result
    }

    companion object {
        fun fromDto(dto: LearnerDto, supervisor: Supervisor): LearnerUser {
            return LearnerUser(supervisor, dto.username, dto.name)
        }
    }

}