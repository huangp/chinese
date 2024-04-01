package com.github.huangp.chinese.backend

import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import java.nio.file.Path
import java.nio.file.Paths

class ImportData {

    @Test
    @Disabled
    fun importData() {
        val lines = Paths.get("/home/pahuang/Downloads/chinese.txt").toFile().readLines(Charsets.UTF_8)

        println("[")
        val quoted = lines.filter { it.isNotBlank() }.map {
            "\"$it\""
        }.toSet()
        println(quoted.joinToString(","))
        println("]")
    }

    @Test
    fun importYear1and2() {
        val base = "/Users/zhuang/work/chinese/src/test/resources"
        val year1a = Paths.get(base, "year1a.txt")
        val year1b = Paths.get(base, "year1b.txt")
        val year1aChars = getAllChars(year1a)
        val year1bChars = getAllChars(year1b)
        val year1Chars = year1aChars + year1bChars
        println(year1Chars)
    }

    @Test
    fun importJayden() {
        val base = "/Users/zhuang/work/chinese/src/test/resources"
        val jayden = Paths.get(base, "jayden.txt")
        val jaydenKnown = getAllChars(jayden)
        println(ObjectMapper().writeValueAsString(jaydenKnown))
    }

    @Test
    fun importAmelia() {
        val base = "/Users/zhuang/work/chinese/src/test/resources"
        val amelia = Paths.get(base, "amelia.txt")
        val ameliaKnown = getAllChars(amelia)
        println(ObjectMapper().writeValueAsString(ameliaKnown))
    }

    private fun getAllChars(year1a: Path): List<String> {
        val lines = year1a.toFile().readLines(Charsets.UTF_8)
        return lines.map { line ->
            line.split(Regex("\\s+")).filter { ch ->
                !ch.matches(Regex("\\d+\\-?\\d*"))
            }
        }.flatten()
    }

}