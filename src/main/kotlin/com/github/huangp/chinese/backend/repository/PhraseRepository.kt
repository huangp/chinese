package com.github.huangp.chinese.backend.repository

import com.github.huangp.chinese.backend.model.Phrase
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.CrudRepository

interface PhraseRepository : JpaRepository<Phrase, Long> {

    fun findByContentHash(contentHash: String): Phrase?

//    fun findTopByOrderBy
}
