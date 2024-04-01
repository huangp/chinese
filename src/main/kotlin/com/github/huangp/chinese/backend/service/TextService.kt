package com.github.huangp.chinese.backend.service

import com.github.huangp.chinese.backend.dto.ScoreDto
import com.github.huangp.chinese.backend.dto.TextCheck
import com.github.huangp.chinese.backend.dto.UpdateScoresDto
import com.github.huangp.chinese.backend.util.PhraseUtil
import io.swagger.annotations.Api
import org.springframework.transaction.annotation.Transactional
import java.util.*
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.Response

const val TEXT_RESOURCE_PATH = "text"
@Path(TEXT_RESOURCE_PATH)
@Consumes("application/json")
@Produces("application/json")
@Api(value = "Text resource", produces = "application/json", consumes = "application/json")
open class TextService @Inject constructor(
        val scoreService: ScoreService,
        val phraseUtil: PhraseUtil
) {
    @PUT
    @Path("/known/{username}")
    @Transactional
    open fun addKnownCharactersForLearner(characters: Set<String>, @PathParam("username") username: String): Response {

        val scoreDtos = characters.map { ch -> ScoreDto(ch, PhraseFamiliarityService.NUM_OF_CORRECT_AS_FAMILIAR_TO_ONE_CHAR, 0, Date()) }
        return scoreService.addScores(username, UpdateScoresDto(listOf(), scoreDtos))
    }

    @POST
    @Path("/check/{username}")
    open fun checkTextWithKnownCharacters(phrases: List<String>, @PathParam("username") username: String): Response {
        val nonEmptyPhrases = phrases
                .filter { it.isNotBlank() }
        val charList: Set<String> = nonEmptyPhrases
                .flatMap { phraseUtil.phraseToCharacters(it) }.toSet()

        val known = scoreService.getKnownCharactersForUser(username, charList)
        val entity = TextCheck(nonEmptyPhrases, known, charList.size, charList.size - known.size)
        return Response.ok(entity).build()
    }

}

