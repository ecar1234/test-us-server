import { Router } from "express";
import { PostController } from "../controllers/post_controller";
import { PostRepository } from "../../infrastructure/repositories/post_repo";
import { PostUseCase } from "../../app/post_use_cast";

const route = Router();

const postUseCase: PostUseCase = new PostUseCase(new PostRepository());
const postController = new PostController(postUseCase);

route.post('/create', postController.createPost.bind(postController));
route.post('/update', postController.updatePost.bind(postController));
route.post('/delete', postController.deletePost.bind(postController));
route.post('/getPostById', postController.getPostById.bind(postController));
route.post('/getPostByTitle', postController.getPostByTitle.bind(postController));
route.get('/getAllPosts', postController.getAllPosts.bind(postController));