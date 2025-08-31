import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl";
import { PostUseCase } from "../../app/PostUseCase";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";

const route = Router();

const postUseCase: PostUseCase = new PostUseCase(new PostRepositoryImpl(), new UserRepositoryImpl());
const postController = new PostController(postUseCase);

route.post('/create', authMiddleware, postController.createPost.bind(postController));
route.put('/update', authMiddleware, postController.updatePost.bind(postController));
route.post('/delete', authMiddleware, postController.deletePost.bind(postController));
route.get('/getPostById/:id', postController.getPostById.bind(postController));
route.get('/getPostByTitle/:title', postController.getPostByTitle.bind(postController));
// route.get('/getAllPosts', postController.getAllPosts.bind(postController));
route.get('/getInitPosts', postController.getInitPosts.bind(postController));
route.get('/getWebPostsPagination', postController.getWebPosts.bind(postController));
route.get('/getMobilePostsPagination', postController.getMobilePosts.bind(postController));
route.get('/getPostsPagination', postController.getPostsPaginations.bind(postController));
route.get('/getPostsByAuthor/:authorId', authMiddleware, postController.getPostsByAuthor.bind(postController));
// route.get('/getPostByNickname/:nickname', postController.getPostsByNickname.bind(postController));

export default route;