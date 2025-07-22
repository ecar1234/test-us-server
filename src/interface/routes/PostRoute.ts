import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl";
import { PostUseCase } from "../../app/PostUseCase";

const route = Router();

const postUseCase: PostUseCase = new PostUseCase(new PostRepositoryImpl());
const postController = new PostController(postUseCase);

route.post('/create', postController.createPost.bind(postController));
route.post('/update', postController.updatePost.bind(postController));
route.post('/delete', postController.deletePost.bind(postController));
route.post('/getPostById', postController.getPostById.bind(postController));
route.post('/getPostByTitle', postController.getPostByTitle.bind(postController));
route.get('/getAllPosts', postController.getAllPosts.bind(postController));

export default route;