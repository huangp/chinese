package com.github.huangp.chinese.backend.service

import com.github.huangp.chinese.backend.dto.LearnerDto
import com.github.huangp.chinese.backend.exception.UniqueConstraintViolationException
import com.github.huangp.chinese.backend.model.LearnerUser
import com.github.huangp.chinese.backend.repository.LearnerRepository
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.transaction.annotation.Transactional
import java.net.URI
import javax.inject.Inject
import javax.validation.Valid
import javax.ws.rs.*
import javax.ws.rs.core.Context
import javax.ws.rs.core.Response
import javax.ws.rs.core.UriInfo

const val USER_RESOURCE_PATH = "user"

@Path(USER_RESOURCE_PATH)
@Consumes("application/json")
@Produces("application/json")
@Api(value = "User resource", produces = "application/json", consumes = "application/json")
@Transactional
open class LearnerUserService @Inject constructor(
        private val learnerRepository: LearnerRepository,
        private val authenticatedSupervisorService: AuthenticatedSupervisorService) {

    @Context
    lateinit var uriInfo: UriInfo

    @POST
    @ApiOperation(value = "Register a new user", response = LearnerDto::class)
    @ApiResponses(value = [
        ApiResponse(code = 201, message = "User created"),
        ApiResponse(code = 400, message = "User with the same username already exists")
    ]
    )
    fun addUser(@Valid user: LearnerDto): Response {

        val existing = user.username?.let {
            learnerRepository.findByUsername(it)
        }
        return if (existing == null) {
            log.info("creating new user: {}", user)
            val supervisor = authenticatedSupervisorService.getAuthenticatedSupervisor()
            val learnerUser = LearnerUser.fromDto(user, supervisor)

            val saved = learnerRepository.save(learnerUser)
            log.info("created new user: {}", user)
            Response.created(URI("${uriInfo.baseUri}${USER_RESOURCE_PATH}/${saved.username}")).entity(user).build()
        } else {
            log.error("username already exists")
            throw UniqueConstraintViolationException("username exists")
        }
    }

    @PUT
    @ApiOperation(value = "Edit a new user by looking up existing user using username", response = LearnerUser::class)
    @ApiResponses(value = [
        ApiResponse(code = 200, message = "User updated"),
        ApiResponse(code = 400, message = "User with given username can not be found")
    ]
    )
    fun edit(@Valid user: LearnerDto, @QueryParam("active") userActive: Boolean = true): Response {
        val existing = user.username?.let {
            learnerRepository.findByUsername(it)
        }
        return if (existing == null) {
            Response.status(Response.Status.BAD_REQUEST)
                    .entity(listOf("user does not exist")).build()
        } else {
            log.info("editing user: {} -> {}", existing, user)
            with(existing) {
                name = user.name
                active = userActive
            }
            val saved = learnerRepository.save(existing)
            log.info("updated user: {}", saved)
            Response.ok(user).build()
        }
    }

    @DELETE
    @Path("/{username}")
    fun delete(@PathParam("username") username: String): Response {
        val found = learnerRepository.findByUsername(username)
        return if (found == null) {
            log.info("{} not found", username)
            Response.notModified().build()
        } else {
            log.info("{} soft delete user: {}", username)
            found.active = false
            learnerRepository.save(found)
            Response.ok().build()
        }
    }

    @DELETE
    fun deleteAll(usernames: Set<String>): Response {
        val users = learnerRepository.findAllByUsernameIn(usernames).map {
            it.softDelete()
        }
        learnerRepository.saveAll(users)
        return Response.ok(listOf("${users.size} of users deleted")).build()
    }

    @GET
    @Transactional(readOnly = true)
    fun getAll(): List<LearnerDto> {
        return learnerRepository.findAllByActive().map { it.toDto() }
    }

    companion object {
        val log: Logger = LoggerFactory.getLogger(LearnerUserService::class.java)
    }
}