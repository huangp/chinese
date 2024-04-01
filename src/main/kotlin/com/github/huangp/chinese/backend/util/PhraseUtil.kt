package com.github.huangp.chinese.backend.util


class PhraseUtil {

    fun phraseToCharacters(phrase: String): Set<String> {
        return phrase.toCharArray().map { it.toString() }.filter {
            !punctuations.contains(it)
        }.toSet()
    }

    companion object {
        val punctuations = setOf(
                ",", ".", "\"", ";", "'", "/", "\\", "!", "?", ":", "<", ">", "`", "~",
                "“",
                "”",
                "‘",
                "’",
                "！",
                "，",
                "。",
                "？",
                "～",
                "·",
                "；",
                "：",
                "、",
                "《",
                "》"
                )
    }
}