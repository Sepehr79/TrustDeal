package me.project.trustdeal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Task {
    
    @Id 
    private String id;

    private String header;

    private String description;

}
