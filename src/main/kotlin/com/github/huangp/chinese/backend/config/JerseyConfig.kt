package com.github.huangp.chinese.backend.config

import com.github.huangp.chinese.backend.exception.UniqueConstraintViolationExceptionMapper
import com.github.huangp.chinese.backend.service.*
import org.glassfish.jersey.server.ResourceConfig
import org.springframework.stereotype.Component
import javax.ws.rs.ApplicationPath
import io.swagger.jaxrs.config.BeanConfig
import io.swagger.jaxrs.listing.ApiListingResource
import io.swagger.jaxrs.listing.SwaggerSerializers


@Component
//@EnableSwagger2
@ApplicationPath("/api")
class JerseyConfig : ResourceConfig() {
    init {
        register(LearnerUserService::class.java)
        register(PhraseService::class.java)
        register(ScoreService::class.java)
        register(SupervisorService::class.java)
        register(TextService::class.java)
        register(UniqueConstraintViolationExceptionMapper::class.java)
        property(org.glassfish.jersey.server.ServerProperties.BV_SEND_ERROR_IN_RESPONSE, true)
//        configureSwagger()
    }

    private fun configureSwagger() {
        register(ApiListingResource::class.java)
        register(SwaggerSerializers::class.java)
        val beanConfig = BeanConfig()
        beanConfig.version = "1.0"
        beanConfig.schemes = arrayOf("http", "https")
        beanConfig.host = "localhost:8080"
        beanConfig.basePath = "/api"
        beanConfig.resourcePackage = "com.github.huangp.chinese.backend.service"
        beanConfig.prettyPrint = true
        beanConfig.scan = true
    }
}