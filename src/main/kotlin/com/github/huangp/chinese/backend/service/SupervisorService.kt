package com.github.huangp.chinese.backend.service

import com.github.huangp.chinese.backend.dto.SupervisorDto
import com.github.huangp.chinese.backend.exception.UniqueConstraintViolationException
import com.github.huangp.chinese.backend.model.Supervisor
import com.github.huangp.chinese.backend.repository.SupervisorRepository
import io.swagger.annotations.Api
import io.swagger.annotations.ApiOperation
import io.swagger.annotations.ApiResponse
import io.swagger.annotations.ApiResponses
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler
import org.springframework.transaction.annotation.Transactional
import java.net.URI
import java.util.*
import javax.inject.Inject
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.validation.Valid
import javax.ws.rs.*
import javax.ws.rs.core.Context
import javax.ws.rs.core.Request
import javax.ws.rs.core.Response
import javax.ws.rs.core.UriInfo


const val SUPERVISOR_RESOURCE_PATH = "supervisor"

@Path(SUPERVISOR_RESOURCE_PATH)
@Consumes("application/json")
@Produces("application/json")
@Api(value = "Phrase resource", produces = "application/json", consumes = "application/json")
open class SupervisorService @Inject constructor(
        private val authenticatedSupervisorService: AuthenticatedSupervisorService,
        private val passwordEncoder: PasswordEncoder,
        private val supervisorRepository: SupervisorRepository) {

    @Context
    lateinit var uriInfo: UriInfo

    @Context
    lateinit var httpRequest: HttpServletRequest

    @Context
    lateinit var httpResponse: HttpServletResponse

    @POST
    @Path("register")
    @ApiOperation(value = "Add Supervisor", response = Void::class)
    @ApiResponses(value = [
        ApiResponse(code = 201, message = "Supervisor created"),
        ApiResponse(code = 409, message = "Supervisor with same username already exists")
    ]
    )
    @Transactional
    open fun registerSupervisor(@Valid supervisorDto: SupervisorDto): Response {
        val existing: Optional<Supervisor> = supervisorRepository.findById(supervisorDto.username)
        return if (!existing.isPresent) {
            log.info("creating new supervisor: {}", supervisorDto.username)
            val passwordHash = passwordEncoder.encode(supervisorDto.password)
            val saved = supervisorRepository.save(Supervisor.fromDto(supervisorDto, passwordHash))

            Response.created(URI("${uriInfo.baseUri}${SUPERVISOR_RESOURCE_PATH}/${saved.username}")).build()
        } else {
            log.info("username {} already exists", supervisorDto.username)
            throw UniqueConstraintViolationException("${supervisorDto.username} already exists")
        }
    }

    @GET
    @Transactional(readOnly = true)
    open fun getSupervisor(@QueryParam("username") username: String): Response {
        // TODO need to secure this endpoint
        val supervisor = supervisorRepository.findById(username)
        return if (supervisor.isPresent) Response.ok(supervisor.get().toDto()).build()
        else Response.status(Response.Status.NOT_FOUND).build()
    }

    // TODO temporarily lives here
    @POST
    @Path("/logout")
    open fun logout(): Response {
        val auth: Authentication = SecurityContextHolder.getContext().authentication
        if (auth != null) {
            SecurityContextLogoutHandler().logout(httpRequest, httpResponse, auth)
        }
        return Response.ok().build()
    }

    companion object {
        val log: Logger = LoggerFactory.getLogger(PhraseService::class.java)
    }
}