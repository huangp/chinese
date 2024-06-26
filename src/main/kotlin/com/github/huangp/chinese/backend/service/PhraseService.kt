package com.github.huangp.chinese.backend.service

import com.github.huangp.chinese.backend.model.Phrase
import com.github.huangp.chinese.backend.model.PhraseFamiliarity
import com.github.huangp.chinese.backend.repository.LearnerRepository
import com.github.huangp.chinese.backend.repository.PhraseFamiliarityRepository
import com.github.huangp.chinese.backend.repository.PhraseRepository
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.transaction.annotation.Transactional
import java.lang.Exception
import java.net.URI
import javax.inject.Inject
import javax.validation.Valid
import javax.ws.rs.*
import javax.ws.rs.core.Context
import javax.ws.rs.core.Response
import javax.ws.rs.core.UriInfo

const val PHRASE_RESOURCE_PATH = "phrase"

@Path(PHRASE_RESOURCE_PATH)
@Consumes("application/json")
@Produces("application/json")
@Api(value = "Phrase resource", produces = "application/json", consumes = "application/json")
open class PhraseService @Inject constructor(
        private val learnerRepository: LearnerRepository,
        private val phraseRepository: PhraseRepository,
        private val authenticatedSupervisorService: AuthenticatedSupervisorService,
        private val phraseFamiliarityRepository: PhraseFamiliarityRepository) {

    @Context
    lateinit var uriInfo: UriInfo

    @POST
    @ApiOperation(value = "Add phrase", response = Phrase::class)
    @ApiResponses(value = [
        ApiResponse(code = 201, message = "Phrase created"),
        ApiResponse(code = 200, message = "Phrase already exists")
    ]
    )
    @Transactional
    open fun addPhrase(@Valid phrase: Phrase): Response {
        val computeContentHash = phrase.toContentHash()
        val existing = computeContentHash?.let {
            phraseRepository.findByContentHash(it)
        }
        return if (existing == null) {
            log.info("creating new phrase: {}", phrase.content?.take(10))
            phrase.contentHash = computeContentHash
            val savedPhrase = phraseRepository.save(phrase)
            log.info("created new phrase: {}", phrase.contentHash)
            // create familiarity for this phrase
            val supervisor = authenticatedSupervisorService.getAuthenticatedSupervisor()
            val learners = learnerRepository.findAllBySupervisorEqualsAndActiveTrue(supervisor)

            learners.forEach {
                phraseFamiliarityRepository.save(PhraseFamiliarity(it, savedPhrase))
            }

            Response.created(URI("${uriInfo.baseUri}${PHRASE_RESOURCE_PATH}/${savedPhrase.contentHash}")).entity(savedPhrase).build()
        } else {
            log.info("content already exists")
            Response.ok().build()
        }
    }

    @PUT
    @Transactional
    open fun bulkAddPhrases(phrases: List<String>, @QueryParam("difficulty") difficulty: Int = 0): Response {
        val supervisor = authenticatedSupervisorService.getAuthenticatedSupervisor()
        val learners = learnerRepository.findAllBySupervisorEqualsAndActiveTrue(supervisor)

        val newPhrases = phrases.toSet().filter { it.isNotBlank() }.map {
            val computeContentHash = Phrase.computeContentHash(it)
            Pair(it, computeContentHash)
        }.filter {
            phraseRepository.findByContentHash(it.second) == null
        }
        newPhrases.forEach {
            val phrase = Phrase()
            phrase.apply {
                this.content = it.first
                this.contentHash = it.second
                this.difficulty = difficulty
            }
            try {
                val savedPhrase = phraseRepository.save(phrase)
                learners.forEach {
                    phraseFamiliarityRepository.save(PhraseFamiliarity(it, savedPhrase))
                }
            } catch (ex: Exception) {
                log.warn("error saving: {}", phrase, ex)
            }
            log.info("saved {}", phrase)
        }

        // TODO not exactly the new added phrases location
        return Response.created(URI("${uriInfo.baseUri}${PHRASE_RESOURCE_PATH}")).entity(newPhrases.map { it.first }).build()
    }



    @GET
    @Transactional(readOnly = true)
    open fun getAll(): List<Phrase> {
        return phraseRepository.findAll().toList()
    }

    @GET
    @Path("allcharacters")
    @Transactional(readOnly = true)
    open fun getAllCharacters(): Set<String> {
        val allChars: List<String> = phraseRepository.findAll().map { phrase -> phrase.content.toCharArray().map { it.toString() } }.flatten()
        return allChars.toSet()
    }

    @GET
    @Path("allcharacters/size")
    @Transactional(readOnly = true)
    open fun getAllCharactersSize(): Int {
        val allChars: List<String> = phraseRepository.findAll().map { phrase -> phrase.content.toCharArray().map { it.toString() } }.flatten()
        return allChars.toSet().size
    }

    @GET
    @Path("recent")
    @Transactional(readOnly = true)
    open fun getRecentPhrases(): Set<String> {
        // TODO get phrase that are with less familiarity and recently visited for authenticated supervisor
        val supervisor = authenticatedSupervisorService.getAuthenticatedSupervisor()
        val learners = learnerRepository.findAllBySupervisorEqualsAndActiveTrue(supervisor)
        val phrasesFamiliarity = phraseFamiliarityRepository
                .findTop20ByLearnerInAndFamiliarityBetweenOrderByLastModifiedDateDesc(learners, 0, PhraseFamiliarityService.MAX_FAMILIARITY)
        return phrasesFamiliarity.mapNotNull { it.phrase?.content }.toSet()

    }

    @GET
    @Path("next")
    @Transactional(readOnly = true)
    open fun getNextPhrases(@QueryParam("page") @DefaultValue("0") page: Int, @QueryParam("size") @DefaultValue("20") size: Int): Set<String> {
        val supervisor = authenticatedSupervisorService.getAuthenticatedSupervisor()
        val learners = learnerRepository.findAllBySupervisorEqualsAndActiveTrue(supervisor)
        val pager: Pageable = PageRequest.of(page, size)
        val phrasesFamiliarity = phraseFamiliarityRepository
                .findByLearnerInAndFamiliarityBetweenOrderByLastModifiedDateDesc(learners, 0, PhraseFamiliarityService.MAX_FAMILIARITY, pager)
        return phrasesFamiliarity.mapNotNull { it.phrase?.content }.toSet()

    }

    companion object {
        val log: Logger = LoggerFactory.getLogger(PhraseService::class.java)
    }
}