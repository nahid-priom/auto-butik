import cartReducer, { CART_NAMESPACE } from '~/store/cart/cartReducer';
import compareReducer, { COMPARE_NAMESPACE } from '~/store/compare/compareReducer';
import currencyReducer, { CURRENCY_NAMESPACE } from '~/store/currency/currencyReducer';
import garageReducer, { GARAGE_NAMESPACE } from '~/store/garage/garageReducer';
import homepageReducer from '~/store/homepage/homepageReducer';
import { HOMEPAGE_NAMESPACE } from '~/store/homepage/homepageTypes';
import mobileMenuReducer, { MOBILE_MENU_NAMESPACE } from '~/store/mobile-menu/mobileMenuReducer';
import optionsReducer, { OPTIONS_NAMESPACE } from '~/store/options/optionsReducer';
import pageLoadReducer from '~/store/page-load/pageLoadReducer';
import { PAGE_LOAD_NAMESPACE } from '~/store/page-load/pageLoadTypes';
import loadingTrackerReducer from '~/store/loading-tracker/loadingTrackerReducer';
import { LOADING_TRACKER_NAMESPACE } from '~/store/loading-tracker/loadingTrackerTypes';
import quickviewReducer, { QUICKVIEW_NAMESPACE } from '~/store/quickview/quickviewReducer';
import shopReducer from '~/store/shop/shopReducer';
import userReducer, { USER_NAMESPACE } from '~/store/user/userReducer';
import wishlistReducer, { WISHLIST_NAMESPACE } from '~/store/wishlist/wishlistReducer';
import { AppReducerStateType } from '~/store/types';
import { SHOP_NAMESPACE } from '~/store/shop/shopTypes';

export interface IRootState {
    [CART_NAMESPACE]: AppReducerStateType<typeof cartReducer>;
    [COMPARE_NAMESPACE]: AppReducerStateType<typeof compareReducer>;
    [CURRENCY_NAMESPACE]: AppReducerStateType<typeof currencyReducer>;
    [GARAGE_NAMESPACE]: AppReducerStateType<typeof garageReducer>;
    [HOMEPAGE_NAMESPACE]: AppReducerStateType<typeof homepageReducer>;
    [MOBILE_MENU_NAMESPACE]: AppReducerStateType<typeof mobileMenuReducer>;
    [OPTIONS_NAMESPACE]: AppReducerStateType<typeof optionsReducer>;
    [PAGE_LOAD_NAMESPACE]: AppReducerStateType<typeof pageLoadReducer>;
    [LOADING_TRACKER_NAMESPACE]: AppReducerStateType<typeof loadingTrackerReducer>;
    [QUICKVIEW_NAMESPACE]: AppReducerStateType<typeof quickviewReducer>;
    [SHOP_NAMESPACE]: AppReducerStateType<typeof shopReducer>;
    [USER_NAMESPACE]: AppReducerStateType<typeof userReducer>;
    [WISHLIST_NAMESPACE]: AppReducerStateType<typeof wishlistReducer>;
}
