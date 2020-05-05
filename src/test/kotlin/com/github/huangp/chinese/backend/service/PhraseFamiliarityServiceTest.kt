package com.github.huangp.chinese.backend.service

import com.github.huangp.chinese.backend.model.*
import com.github.huangp.chinese.backend.repository.PhraseFamiliarityRepository
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.*
import java.util.concurrent.CountDownLatch


internal class PhraseFamiliarityServiceTest {

    @Mock
    private lateinit var phraseFamiliarityRepository: PhraseFamiliarityRepository
    private val learnerUser: LearnerUser = LearnerUser(null, "pahuang")
    @Captor
    private lateinit var savedCaptor: ArgumentCaptor<Iterable<PhraseFamiliarity>>

    private lateinit var service: PhraseFamiliarityService

    @BeforeEach
    fun setUp() {
        MockitoAnnotations.initMocks(this)
        service = PhraseFamiliarityService(phraseFamiliarityRepository)
    }

    private fun toPhraseFamiliarity(vararg contents: String): List<PhraseFamiliarity> {
        val list = mutableListOf<PhraseFamiliarity>()
        contents.withIndex().forEach { (index, content) ->
            list.add(PhraseFamiliarity(learnerUser, Phrase(index.toLong(), 1, content)))
        }
        return list
    }

    @Test
    fun checkCalculation() {
        val contents = listOf("abc")
        BDDMockito.given(phraseFamiliarityRepository.findPhraseFamiliaritiesByLearnerEqualsAndPhraseContentIn(learnerUser, contents))
                .willReturn(toPhraseFamiliarity(*contents.toTypedArray()))
        val countDownLatch = CountDownLatch(1)

        BDDMockito.given(phraseFamiliarityRepository.saveAll(savedCaptor.capture())).willAnswer {
            countDownLatch.countDown()
            savedCaptor.value
        }

        service.calculateFromScores(learnerUser, listOf(Score(1, "a", 1, 0)), contents)
        countDownLatch.await()

        val saved = savedCaptor.value
        Assertions.assertThat(saved).hasSize(1)
        // one correct in 3 letters phrase will add 100 / 3 / 6 = 5
        Assertions.assertThat(saved.toList()[0].familiarity).isEqualTo(5)

    }

    @Test
    fun repeatCharacterWillNotExceedPerCharLimit() {
        val contents = listOf("abc")
        BDDMockito.given(phraseFamiliarityRepository.findPhraseFamiliaritiesByLearnerEqualsAndPhraseContentIn(learnerUser, contents))
                .willReturn(toPhraseFamiliarity(*contents.toTypedArray()))
        val countDownLatch = CountDownLatch(1)

        BDDMockito.given(phraseFamiliarityRepository.saveAll(savedCaptor.capture())).willAnswer {
            countDownLatch.countDown()
            savedCaptor.value
        }

        service.calculateFromScores(learnerUser, listOf(Score(1, "a", 100, 0)), contents)
        countDownLatch.await()

        val saved = savedCaptor.value
        Assertions.assertThat(saved).hasSize(1)
        // one correct in 3 letters phrase will add 100 / 3 / 6 = 5
        // per char max is 100 / 3 = 33
        Assertions.assertThat(saved.toList()[0].familiarity).isEqualTo(33)

    }


}