package com.github.huangp.chinese.backend.model

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.io.Serializable
import java.lang.IllegalStateException
import java.security.MessageDigest
import java.util.*
import javax.persistence.*
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.Size


@Entity
@EntityListeners(AuditingEntityListener::class)
@Access(AccessType.FIELD)
class Phrase(
        @Id
        @GeneratedValue
        open var id: Long? = null,
        @Version
        open var version: Int = 1,
        @get: NotEmpty
        @get: Size(min = 2, max = 255)
        @Column(nullable = false, updatable = false)
        open var content: String = "",
        @Column(unique = true, nullable = false, updatable = false)
        open var contentHash: String = "",
        @Column
        open var difficulty: Int = 0,
        @Column
        @CreatedDate
        open var createdDate: Date = Date(),
        @Column
        @LastModifiedDate
        open var modifiedDate: Date = Date()

) : Serializable {
    constructor() : this(null)

    @PrePersist
    fun prePersist() {
        if (contentHash.isNullOrBlank() && !content.isNullOrBlank()) {
            contentHash = toContentHash()
        }
    }

    fun toContentHash(): String {
        return computeContentHash(content)
    }

    companion object {
        fun computeContentHash(content: String): String {
            val messageDigest = MessageDigest.getInstance("SHA-256")
            messageDigest.update(content.toByteArray(Charsets.UTF_8))
            return Base64.getEncoder().encodeToString(messageDigest.digest())
        }
    }
}