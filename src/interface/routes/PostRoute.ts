import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl";
import { PostUseCase } from "../../app/PostUseCase";

const route = Router();

const postUseCase: PostUseCase = new PostUseCase(new PostRepositoryImpl());
const postController = new PostController(postUseCase);

route.post('/create', postController.createPost.bind(postController));
route.put('/update', postController.updatePost.bind(postController));
route.post('/delete', postController.deletePost.bind(postController));
route.get('/getPostById/:id', postController.getPostById.bind(postController));
route.get('/getPostByTitle/:title', postController.getPostByTitle.bind(postController));
route.get('/getAllPosts', postController.getAllPosts.bind(postController));
route.get('/getPostsByAuthor/:authorId', postController.getPostsByAuthor.bind(postController));
// route.get('/getPostByNickname/:nickname', postController.getPostsByNickname.bind(postController));

export default route;