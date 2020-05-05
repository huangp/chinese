package com.github.huangp.chinese.backend.repository

import com.github.huangp.chinese.backend.model.LearnerUser
import com.github.huangp.chinese.backend.model.PhraseFamiliarity
import com.github.huangp.chinese.backend.model.PhraseFamiliarityId
import com.github.huangp.chinese.backend.model.Supervisor
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import javax.persistence.NamedEntityGraph

interface PhraseFamiliarityRepository : JpaRepository<PhraseFamiliarity, PhraseFamiliarityId> {

    fun findTop20ByLearnerInAndFamiliarityBetweenOrderByLastModifiedDateDesc(
            learners: List<LearnerUser>, startFamiliarity: Int, endFamiliarity: Int): List<PhraseFamiliarity>

    @EntityGraph("phraseFamiliarityGraph")
    fun findPhraseFamiliaritiesByLearnerEqualsAndPhraseContentIn(learnerUser: LearnerUser, contentHashes: List<String>): List<PhraseFamiliarity>

    fun findByLearnerInAndFamiliarityBetweenOrderByLastModifiedDateDesc(
            learners: List<LearnerUser>, startFamiliarity: Int, endFamiliarity: Int, pageable: Pageable): List<PhraseFamiliarity>
}