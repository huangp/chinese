package com.github.huangp.chinese.backend

import com.github.huangp.chinese.backend.config.ConfigComponentPackageMarker
import com.github.huangp.chinese.backend.config.JerseyConfig
import com.github.huangp.chinese.backend.repository.RepositoryComponentPackageMarker
import com.github.huangp.chinese.backend.service.ServiceComponentPackageMarker
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication(
		scanBasePackageClasses = [ConfigComponentPackageMarker::class, ServiceComponentPackageMarker::class, RepositoryComponentPackageMarker::class]
)
class ChineseBackendApplication

fun main(args: Array<String>) {
	runApplication<ChineseBackendApplication>(*args)
}

