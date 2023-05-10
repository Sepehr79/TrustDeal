package me.project.trustdeal.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import me.project.trustdeal.model.Task;

@RepositoryRestResource
@CrossOrigin
public interface TaskRepository extends CrudRepository<Task, String>  {
    
}
