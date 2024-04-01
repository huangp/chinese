package com.github.huangp.chinese.backend.util

import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class PhraseUtilTest {
    lateinit var phraseUtil: PhraseUtil
    @BeforeEach
    fun setUp() {
        phraseUtil = PhraseUtil()
    }
    @Test
    fun test() {
        val characters = phraseUtil.phraseToCharacters("从前，有一个大山，山上有一片美丽的村庄。这个村庄里住着天南海北的人们，有你、我、他，还有一位叫李清的小姑娘。")
        Assertions.assertThat(characters).hasSize(35)
    }
}