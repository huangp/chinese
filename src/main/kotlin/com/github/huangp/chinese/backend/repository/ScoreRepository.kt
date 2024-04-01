package com.github.huangp.chinese.backend.repository

import com.github.huangp.chinese.backend.model.LearnerUser
import com.github.huangp.chinese.backend.model.Score
import com.github.huangp.chinese.backend.model.ScoreId
import com.github.huangp.chinese.backend.service.PhraseFamiliarityService
import com.github.huangp.chinese.backend.service.PhraseFamiliarityService.Companion.NUM_OF_CORRECT_AS_FAMILIAR_TO_ONE_CHAR
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface ScoreRepository : CrudRepository<Score, ScoreId> {

    fun findScoresByCharacterInAndLearnerEquals(characters: Iterable<String>, learnerUser: LearnerUser): Iterable<Score>
    fun findScoresByLearnerEquals(learnerUser: LearnerUser): Iterable<Score>

    @Query("from Score where learner = :learnerUser and correct = :correctCount and character in (:characters)")
    fun findKnownCharactersScoresForLearner(characters: Iterable<String>,
                                      learnerUser: LearnerUser,
                                      correctCount: Int = NUM_OF_CORRECT_AS_FAMILIAR_TO_ONE_CHAR): List<Score>

    fun findScoresByLearnerEqualsAndCorrectGreaterThanOrderByFirstSeenAsc(learnerUser: LearnerUser, correctGreaterCount: Int): List<Score>
}