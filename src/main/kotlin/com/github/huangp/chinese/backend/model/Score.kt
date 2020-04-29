package com.github.huangp.chinese.backend.model

import com.github.huangp.chinese.backend.dto.ScoreDto
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.io.Serializable
import java.util.*
import javax.persistence.*

@Entity
@Access(AccessType.FIELD)
@EntityListeners(AuditingEntityListener::class)
@IdClass(ScoreId::class)
class Score(

        @Version
        open var version: Int = 0,
        @Id
        @Column(updatable = false, nullable = false)
        open var character: String = "",
        @Column
        open var correct: Int = 0,
        @Column
        open var incorrect: Int = 0,
        @Id
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "learner")
        open var learner: LearnerUser? = null,
        @CreatedDate
        @Column
        open var firstSeen: Date = Date(),
        @LastModifiedDate
        @Column
        open var lastSeen: Date = Date()


) {
    constructor() : this(0, "", 0, 0)

    override fun toString(): String {
        return "Score(character='$character', correct=$correct, incorrect=$incorrect, firstSeen=$firstSeen, lastSeen=$lastSeen)"
    }

    fun toDto(): ScoreDto {
        return ScoreDto(character, correct, incorrect, firstSeen)
    }

    companion object {
        fun fromDto(dto: ScoreDto, user: LearnerUser): Score {
            return Score(0, dto.character, dto.correct, dto.incorrect, user)
        }
    }

}

class ScoreId(open var learner: String?, open var character: String) : Serializable {
    constructor(): this(null, "")

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ScoreId

        if (learner != other.learner) return false
        if (character != other.character) return false

        return true
    }

    override fun hashCode(): Int {
        var result = learner?.hashCode() ?: 0
        result = 31 * result + character.hashCode()
        return result
    }


}