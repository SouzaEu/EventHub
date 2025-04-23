package com.eventhub.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Bean
    public Map<String, Bucket> rateLimitBuckets() {
        return buckets;
    }

    public Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, this::newBucket);
    }

    private Bucket newBucket(String key) {
        // 100 requisições por minuto
        Bandwidth limit = Bandwidth.simple(100, Duration.ofMinutes(1));
        // Recarrega 100 tokens a cada minuto
        Refill refill = Refill.intervally(100, Duration.ofMinutes(1));
        return Bucket4j.builder()
                .addLimit(limit)
                .addLimit(refill)
                .build();
    }
} 