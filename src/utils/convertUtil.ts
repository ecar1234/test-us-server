import { ApplicationsPlatform, ApplicationStatus } from "../infrastructure/entities/ApplicationEntity.js";
import { BasePostStateType, MobileOsType, PostCategory } from "../infrastructure/enums/PostEnums.js";

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

export const convertStringToCategory = (category: string) => {
    switch (category) {
        case 'game':
            return PostCategory.GAME;
        case 'travel':
            return PostCategory.TRAVEL;
        case 'developerTool':
            return PostCategory.DEVELOPER_TOOL;
        case 'health':
            return PostCategory.HEALTH;
        case 'education':
            return PostCategory.EDUCATION;
        case 'finance':
            return PostCategory.FINANCE;
        case 'weather':
            return PostCategory.WEATHER;
        case 'news':
            return PostCategory.NEWS;
        case 'books':
            return PostCategory.BOOKS;
        case 'life':
            return PostCategory.LIFE;
        case 'business':
            return PostCategory.BUSINESS;
        case 'photography':
            return PostCategory.PHOTOGRAPHY;
        case 'social':
            return PostCategory.SOCIAL;
        case 'sports':
            return PostCategory.SPORTS;
        case 'shopping':
            return PostCategory.SHOPPING;
        case 'food':
            return PostCategory.FOOD;
        case 'utility':
            return PostCategory.UTILITY;
        case 'medical':
            return PostCategory.MEDICAL;
        case 'magazine':
            return PostCategory.MAGAZINE;
        case 'music':
            return PostCategory.MUSIC;
        case 'entertainment':
            return PostCategory.ENTERTAINMENT;
        case 'etc':
            return PostCategory.ETC;
        default:
            return PostCategory.ETC;
    }
}

export const convertMobileOsToString = (os: MobileOsType | null): string | null => {
    if(os === null) return null;
    return MOBILE_OS_STRING[os];
}

export const convertStringToMobileOs = (os: string): MobileOsType | null => {
    if(os === null) return null;
    return STRING_MOBILE_OS[os];
}

export const PLATFORM_TO_STRING: Record<ApplicationsPlatform, string|null> = {
    [ApplicationsPlatform.MOBILE]: 'mobile',
    [ApplicationsPlatform.WEB]: 'web',
    [ApplicationsPlatform.EMPTY]: null
}

export const STRING_TO_PLATFORM: Record<string, ApplicationsPlatform> = {
    ['mobile']: ApplicationsPlatform.MOBILE,
    ['web']: ApplicationsPlatform.WEB
}

export const MOBILE_OS_STRING: Record<MobileOsType, string> = {
    [MobileOsType.ANDROID]: 'android',
    [MobileOsType.IOS]: 'ios',
};

export const STRING_MOBILE_OS: Record<string | null, MobileOsType> = {
    ['android']: MobileOsType.ANDROID,
    ['ios']: MobileOsType.IOS
}

export const POST_STATUS_TO_STRING: Record<BasePostStateType, string> = {
    [BasePostStateType.ACTIVE]: 'active',
    [BasePostStateType.DELETE]: 'delete',
    [BasePostStateType.END]: 'end',
    [BasePostStateType.EXPIRED]: 'exprired'
}
export const STRING_TO_POST_STATUS: Record<string, BasePostStateType> = {
    ['active']: BasePostStateType.ACTIVE,
    ['delete']: BasePostStateType.DELETE,
    ['end']: BasePostStateType.END,
    ['expired']: BasePostStateType.EXPIRED
}

export const APPLICATION_STATUS_TO_STRING: Record<ApplicationStatus, string> = {
    [ApplicationStatus.ACCEPTED]: 'accepted',
    [ApplicationStatus.CANCEL]: 'cancel',
    [ApplicationStatus.PENDING]: 'pending',
    [ApplicationStatus.REJECTED]: 'rejected'
}

export const STRING_TO_APPLICATION_STATUS: Record<string, ApplicationStatus> = {
    ['accepted']: ApplicationStatus.ACCEPTED,
    ['cancel']: ApplicationStatus.CANCEL,
    ['pending']: ApplicationStatus.PENDING,
    ['rejected']: ApplicationStatus.REJECTED
}