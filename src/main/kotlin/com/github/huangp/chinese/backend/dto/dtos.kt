package com.github.huangp.chinese.backend.dto

import java.util.*
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotEmpty
import javax.validation.constraints.NotNull
import javax.validation.constraints.Size

data class ScoreDto(@get: NotBlank @get: Size(min = 1, max = 1) val character: String, val correct: Int, val incorrect: Int, val firstSeen: Date?)

data class SupervisorDto(@get: NotBlank @get: Size(min = 5, max = 40) val username: String,
                         @get: NotBlank @get: Size(min = 5, max = 40)  val password: String)

data class LearnerDto(@get: NotBlank @get: Size(min = 5, max = 40) val username: String, @get: NotBlank @get: Size(min = 5, max = 40) val name: String)

/**
 * Used by add score end point
 */
data class UpdateScoresDto(@get: NotEmpty val phrases: List<String>, @get: NotNull val scores: List<ScoreDto>)

data class TextCheck(val phrases: List<String>, val known: Set<String>, val total: Int, val unknownCount: Int)