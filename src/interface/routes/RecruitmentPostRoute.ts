import { Router } from "express";

const route = Router();

// const recruitmentPostRepo = new RecruitmentPostRepositoryImpl();
// const userRepo = new UserRepositoryImpl();
// const appRepo = new ApplicationRepositoryImpl();
// const postRepo = new PostRepositoryImpl();

// const recruitmentPostUseCase = new RecruitmentPostUseCase(recruitmentPostRepo);
// const postUseCase = new PostUseCase(postRepo, recruitmentPostRepo);
// const postController = new RecruitmentPostController(recruitmentPostUseCase, postUseCase);

// route.post('/create', authMiddleware, postController.createPost.bind(postController));
// route.put('/update', authMiddleware, postController.updatePost.bind(postController));
// route.post('/delete', authMiddleware, postController.deletePost.bind(postController));
// route.get('/getPostById/:id', postController.getPostById.bind(postController));
// route.get('/getUserRecruitmentPosts/:userId', postController.getUserRecuritmentPosts.bind(postController));
// route.get('/getPostByTitle/:title', postController.getPostByTitle.bind(postController));
// // route.get('/getAllPosts', postController.getAllPosts.bind(postController));
// route.get('/getInitPosts', postController.getInitPosts.bind(postController));
// // route.get('/getWebPostsPagination', postController.getWebPosts.bind(postController));
// // route.get('/getMobilePostsPagination', postController.getMobilePosts.bind(postController));
// route.get('/getPostsPagination', postController.getPostsPaginations.bind(postController));
// route.get('/getPostsByAuthor/:authorId', authMiddleware, postController.getPostsByAuthor.bind(postController));
// // route.get('/getPostByNickname/:nickname', postController.getPostsByNickname.bind(postController));

export default route;