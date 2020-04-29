package com.github.huangp.chinese.backend.service

import com.github.huangp.chinese.backend.dto.ScoreDto
import com.github.huangp.chinese.backend.dto.UpdateScoresDto
import com.github.huangp.chinese.backend.model.Phrase
import com.github.huangp.chinese.backend.model.Score
import com.github.huangp.chinese.backend.model.ScoreId
import com.github.huangp.chinese.backend.repository.ScoreRepository
import com.github.huangp.chinese.backend.repository.LearnerRepository
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional
import javax.inject.Inject
import javax.validation.Valid
import javax.ws.rs.*
import javax.ws.rs.core.Context
import javax.ws.rs.core.Response
import javax.ws.rs.core.UriInfo

const val SCORE_RESOURCE_PATH = "score"

@Path(SCORE_RESOURCE_PATH)
@Consumes("application/json")
@Produces("application/json")
@Api(value = "Score resource", produces = "application/json", consumes = "application/json")
open class ScoreService @Inject constructor(
        private val scoreRepository: ScoreRepository,
        private val learnerRepository: LearnerRepository,
        private val phraseFamiliarityService: PhraseFamiliarityService) {

    @Context
    lateinit var uriInfo: UriInfo

    @POST
    @ApiOperation(value = "Add scores for a user", response = Void::class)
    @ApiResponses(value = [
        ApiResponse(code = 201, message = "Phrase created"),
        ApiResponse(code = 200, message = "Phrase already exists")
    ]
    )
    @Path("/user/{username}")
    @Transactional
    open fun addScores(@PathParam("username") username: String, @Valid updateScores: UpdateScoresDto): Response {
        val user = learnerRepository.findByUsername(username)
        return if (user == null) {
            Response.status(Response.Status.NOT_FOUND).build()
        } else {
            // only interested in scores that has actual value
            val scores = updateScores.scores
            if (scores.isEmpty()) {
                return Response.ok().build()
            }

            val scoreIds = scores.map { ScoreId(user.username, it.character) }
            val charScoreMap: Map<String, Pair<Int, Int>> = scores.map { it.character to Pair(it.correct, it.incorrect) }.toMap()
            val existing: Iterable<Score> = scoreRepository.findAllById(scoreIds)
            // update count
            existing.forEach {
                val defaultValue = Pair(0, 0)
                it.correct += charScoreMap.getOrDefault(it.character, defaultValue).first
                it.incorrect += charScoreMap.getOrDefault(it.character, defaultValue).second
            }

            val existingChars: List<String> = existing.map { it.character }
            // for existing scores, update them
            val newChars: List<Score> = scores.filter { !existingChars.contains(it.character) }.map { Score.fromDto(it, user) }

            val combined = existing + newChars
            val saved: Iterable<Score> = scoreRepository.saveAll(combined)

            // calculate familiarity for each phrase
            phraseFamiliarityService.calculateFromScores(saved, updateScores.phrases)
            val result = saved.map { it.toDto() }
            log.info("scores saved {}", result)
            Response.ok().build()
        }

    }

    @GET
    @Path("user/{username}")
    @Transactional(readOnly = true)
    open fun getAllForUser(@PathParam("username") username: String, @QueryParam("phrase") phrase: String): Response {
        val user = learnerRepository.findByUsername(username)
        return if (user == null || phrase.isBlank()) {
            Response.status(Response.Status.NOT_FOUND).build()
        } else {
            val characters = phrase.toCharArray().map { it.toString() }
            log.info("characters: {}", characters)
            val scores: List<ScoreDto> = scoreRepository.findScoresByCharacterInAndLearnerEquals(characters, user).map { it.toDto() }
            Response.ok(scores).build()
        }
    }



    @GET
    @Transactional(readOnly = true)
    open fun getAll(): List<Score> {
        return scoreRepository.findAll().toList()
    }

    companion object {
        val log: Logger = LoggerFactory.getLogger(ScoreService::class.java)
    }
}