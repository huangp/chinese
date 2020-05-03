package com.github.huangp.chinese.backend.repository

import com.github.huangp.chinese.backend.model.LearnerUser
import com.github.huangp.chinese.backend.model.Score
import com.github.huangp.chinese.backend.model.ScoreId
import org.springframework.data.repository.CrudRepository

interface ScoreRepository : CrudRepository<Score, ScoreId> {

    fun findScoresByCharacterInAndLearnerEquals(characters: Iterable<String>, learnerUser: LearnerUser): Iterable<Score>

    fun findScoresByLearnerEqualsAndCorrectGreaterThanOrderByFirstSeenAsc(learnerUser: LearnerUser, correctGreaterCount: Int): List<Score>
}