package com.github.huangp.chinese.backend.config

import com.github.huangp.chinese.backend.repository.SupervisorRepository
import com.github.huangp.chinese.backend.security.AuthUserDetailService
import com.github.huangp.chinese.backend.security.UserDetailsMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import java.security.SecureRandom
import javax.inject.Inject


@Configuration
@EnableWebSecurity
class WebSecurityConfig : WebSecurityConfigurerAdapter() {

    @Bean
    fun databaseUserDetailsService(supervisorRepository: SupervisorRepository, userDetailsMapper: UserDetailsMapper): AuthUserDetailService {
        return AuthUserDetailService(supervisorRepository, userDetailsMapper)
    }

    @Bean
    fun userDetailMapper(): UserDetailsMapper {
        return UserDetailsMapper()
    }

    @Inject
    private lateinit var databaseUserDetailService: AuthUserDetailService

    override fun configure(http: HttpSecurity) {
        http
                .headers().frameOptions().sameOrigin() // this enables h2 console
                .and()
                .cors()
                .and()
                .csrf()
                .disable()
                .authorizeRequests()
                .antMatchers("/api/supervisor/register", "/h2-console/**")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .httpBasic()
//                .authenticationEntryPoint(basicAuthEntryPoint)
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        // TODO allow for development mode
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:8080", "http://localhost:8081", "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowCredentials = true
        configuration.allowedHeaders = listOf("origin" ,"content-type", "accept", "authorization")
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }

    @Bean
    fun daoAuthenticationProvider(): AuthenticationProvider? {
        val provider = DaoAuthenticationProvider()
        provider.setPasswordEncoder(passwordEncoder())
        provider.setUserDetailsService(databaseUserDetailService)
        return provider
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder(10, SecureRandom())
    }
}