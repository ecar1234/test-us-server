import { PostCategory } from "../infrastructure/entities/PostEntities/BasePostEntity.js";

export const convertCategoryToString = (category: PostCategory) => {
     switch (category) {
            case PostCategory.GAME:
                return 'game';
            case PostCategory.TRAVEL:
                return 'travel';
            case PostCategory.DEVELOPER_TOOL:
                return 'developerTool';
            case PostCategory.HEALTH:
                return 'health';
            case PostCategory.EDUCATION:
                return 'education';
            case PostCategory.FINANCE:
                return 'finance';
            case PostCategory.WEATHER:
                return 'weather';
            case PostCategory.NEWS:
                return 'news';
            case PostCategory.BOOKS:
                return 'books';
            case PostCategory.LIFE:
                return 'life';
            case PostCategory.BUSINESS:
                return 'business';
            case PostCategory.PHOTOGRAPHY:
                return 'photography';
            case PostCategory.SOCIAL:
                return 'social';
            case PostCategory.SPORTS:
                return 'sports';
            case PostCategory.SHOPPING:
                return 'shopping';
            case PostCategory.FOOD:
                return 'food';
            case PostCategory.UTILITY:
                return 'utility';
            case PostCategory.MEDICAL:
                return 'medical';
            case PostCategory.MAGAZINE:
                return 'magazine';
            case PostCategory.MUSIC:
                return 'music';
            case PostCategory.ENTERTAINMENT:
                return 'entertainment';
            case PostCategory.ETC:
                return 'etc';
            default:
                return 'etc';
        }
};