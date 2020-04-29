package com.github.huangp.chinese.backend

import org.junit.jupiter.api.Test
import java.nio.file.Paths

class ImportData {

    @Test
    fun importData() {
        val lines = Paths.get("/home/pahuang/Downloads/chinese.txt").toFile().readLines(Charsets.UTF_8)

        println("[")
        val quoted = lines.filter { it.isNotBlank() }.map {
            "\"$it\""
        }.toSet()
        println(quoted.joinToString(","))
        println("]")
    }
}