package com.github.huangp.chinese.backend.service

import com.github.huangp.chinese.backend.model.PhraseFamiliarity
import com.github.huangp.chinese.backend.model.Score
import com.github.huangp.chinese.backend.repository.PhraseFamiliarityRepository
import io.reactivex.Observable
import io.reactivex.schedulers.Schedulers
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.inject.Inject
import kotlin.math.max

class PhraseFamiliarityService @Inject constructor(
        private val phraseFamiliarityRepository: PhraseFamiliarityRepository) {

    fun calculateFromScores(scores: Iterable<Score>, phrases: List<String>) {
        val pf = phraseFamiliarityRepository.findPhraseFamiliaritiesByPhraseContentIn(phrases)

        val observable = Observable.fromIterable(pf)

        observable
                .observeOn(Schedulers.computation()) // operate in computation thread
                .map { phraseFamiliarity ->
                    logger.info("working on {}", phraseFamiliarity.phrase?.content)
                    // restart familiarity from scratch
                    phraseFamiliarity.familiarity = 0
                    with(phraseFamiliarity.phrase?.content ?: "") {
                        scores.forEach { score ->
                            val points: Int = calculatePhrasePointsFromScore(score, this)
                            phraseFamiliarity.familiarity += points
                        }
                        phraseFamiliarity
                    }
                }
                .collect({ mutableListOf<PhraseFamiliarity>() }, { acc, item ->
                    acc.add(item)
                    acc
                })
                .subscribe { pfList: List<PhraseFamiliarity> ->
                    logger.info("saving {} phrase familiarity", pfList.size)
                    phraseFamiliarityRepository.saveAll(pfList)
                }
    }

    companion object {
        private val logger: Logger = LoggerFactory.getLogger(PhraseFamiliarityService::class.java)
        private const val MAX_FAMILIARITY = 100
        private const val NUM_OF_CORRECT_AS_FAMILIAR_TO_ONE_CHAR = 10
        private const val INCORRECT_PENALTY = 0.5

        fun calculatePhrasePointsFromScore(score: Score, phraseContent: String): Int {
            if (!phraseContent.contains(score.character)) return 0

            val perCharacterMaxPoints: Double = (MAX_FAMILIARITY / phraseContent.length).toDouble()
            val correctOnceBonusPoints: Double = perCharacterMaxPoints / NUM_OF_CORRECT_AS_FAMILIAR_TO_ONE_CHAR
            val points = (score.correct * correctOnceBonusPoints) - (score.incorrect * correctOnceBonusPoints * INCORRECT_PENALTY)
            return when {
                points < 0 -> 0
                points > perCharacterMaxPoints -> perCharacterMaxPoints.toInt()
                else -> points.toInt()
            }
        }
    }
}