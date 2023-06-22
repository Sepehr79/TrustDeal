package me.project.trustdeal.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import me.project.trustdeal.model.TaskReview;

@RepositoryRestResource
@CrossOrigin
public interface TaskReviewRepository extends CrudRepository<TaskReview, Integer> {

    List<TaskReview> findByUserAddress(@Param("userAddress") String userAddress);

}
