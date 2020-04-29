package com.github.huangp.chinese.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.AuditorAware

import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import java.util.*


@Configuration
@EnableJpaAuditing(/*auditorAwareRef = "auditorProvider"*/)
class JpaAuditConfig {
//    @Bean
//    fun auditorProvider(): AuditorAware<String> { /*
//          if you are using spring security, you can get the currently logged username with following code segment.
//          SecurityContextHolder.getContext().getAuthentication().getName()
//         */
//        return AuditorAware { Optional.ofNullable("pahuang") }
//    }
}