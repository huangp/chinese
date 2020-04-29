package com.github.huangp.chinese.backend.config

import com.github.huangp.chinese.backend.repository.PhraseFamiliarityRepository
import com.github.huangp.chinese.backend.service.PhraseFamiliarityService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AppConfig {

    @Bean
    fun phraseFamiliarService(phraseFamiliarityRepository: PhraseFamiliarityRepository): PhraseFamiliarityService {
        return PhraseFamiliarityService(phraseFamiliarityRepository)
    }
}