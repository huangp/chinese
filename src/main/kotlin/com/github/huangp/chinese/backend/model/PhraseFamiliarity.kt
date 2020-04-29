package com.github.huangp.chinese.backend.model

import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.io.Serializable
import java.util.*
import javax.persistence.*

@Entity
@NamedEntityGraph(name = "phraseFamiliarityGraph", attributeNodes = [
    NamedAttributeNode("phrase")
]) // to eagerly fetch phrase
@Access(AccessType.FIELD)
@EntityListeners(AuditingEntityListener::class)
@IdClass(PhraseFamiliarityId::class)
class PhraseFamiliarity(
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "learner")
        @Id
        open var learner: LearnerUser?,
        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "phrase")
        @Id
        open var phrase: Phrase?,
        @Column
        open var familiarity: Int = 0,
        @Column
        open var createDate: Date = Date(),
        @Column
        open var lastModifiedDate: Date = Date()

) : Serializable {
    constructor(): this(null, null)

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PhraseFamiliarity

        if (learner != other.learner) return false
        if (phrase != other.phrase) return false

        return true
    }

    override fun hashCode(): Int {
        var result = learner?.hashCode() ?: 0
        result = 31 * result + (phrase?.hashCode() ?: 0)
        return result
    }


}

class PhraseFamiliarityId(open var phrase: Long?, open var learner: String?) : Serializable {
    constructor(): this(null, null)

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PhraseFamiliarityId

        if (phrase != other.phrase) return false
        if (learner != other.learner) return false

        return true
    }

    override fun hashCode(): Int {
        var result = phrase?.hashCode() ?: 0
        result = 31 * result + (learner?.hashCode() ?: 0)
        return result
    }

}