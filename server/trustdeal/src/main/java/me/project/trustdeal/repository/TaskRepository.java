package me.project.trustdeal.repository;

import org.springframework.data.repository.CrudRepository;

import me.project.trustdeal.model.Task;

public interface TaskRepository extends CrudRepository<Task, String>  {
    
}
